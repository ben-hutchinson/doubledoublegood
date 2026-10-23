import { expect, test } from '@playwright/test';

const expectedLinks = [
  { label: 'About', href: '/about/' },
  { label: 'Find Us', href: '/find-us/' },
  { label: 'Sell Your Vinyl', href: '/sell/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Reviews', href: '/reviews/' },
];

test('primary navigation has five live links, active state, and keyboard focus', async ({
  page,
}) => {
  await page.goto('/about/');

  const nav = page.getByRole('navigation', { name: 'Primary' });
  const links = nav.getByRole('link');

  await expect(links).toHaveCount(5);
  const actualLinks = await links.evaluateAll((elements) =>
    elements.map((element) => ({
      label: element.textContent?.trim(),
      href: element.getAttribute('href'),
    })),
  );
  expect(actualLinks).toEqual(expectedLinks);
  await expect(links.nth(0)).toHaveAttribute('aria-current', 'page');

  const firstLink = links.first();
  let firstLinkReached = false;
  for (let index = 0; index < 20; index += 1) {
    await page.keyboard.press('Tab');
    firstLinkReached = await firstLink.evaluate(
      (element) => document.activeElement === element,
    );
    if (firstLinkReached) break;
  }

  expect(firstLinkReached).toBe(true);
  await expect(firstLink).toBeFocused();
  expect(
    await firstLink.evaluate(
      (element) =>
        element.matches(':focus-visible') &&
        window.getComputedStyle(element).outlineStyle !== 'none',
    ),
  ).toBe(true);
});

test('desktop primary navigation uses five equal columns across its content width', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/about/');

  const navList = page
    .getByRole('navigation', { name: 'Primary' })
    .locator('ul');
  const layout = await navList.evaluate((element) => {
    const style = window.getComputedStyle(element);
    const listBox = element.getBoundingClientRect();
    const children = Array.from(element.querySelectorAll('li')).map((child) => {
      const box = child.getBoundingClientRect();
      return { left: box.left, right: box.right, width: box.width };
    });

    return {
      columnCount: style.gridTemplateColumns.split(' ').length,
      fontSize: Number.parseFloat(
        window.getComputedStyle(element.querySelector('a')!).fontSize,
      ),
      contentLeft: listBox.left + Number.parseFloat(style.paddingLeft),
      contentRight: listBox.right - Number.parseFloat(style.paddingRight),
      columnGap: Number.parseFloat(style.columnGap),
      children,
    };
  });

  expect(layout.columnCount).toBe(5);
  expect(layout.fontSize).toBeGreaterThanOrEqual(16);
  expect(layout.children).toHaveLength(5);
  expect(layout.children[0].left).toBeCloseTo(layout.contentLeft, 0);
  expect(layout.children[4].right).toBeCloseTo(layout.contentRight, 0);
  for (let index = 1; index < layout.children.length; index += 1) {
    expect(layout.children[index].width).toBeCloseTo(
      layout.children[0].width,
      0,
    );
    expect(layout.children[index].left).toBeCloseTo(
      layout.children[index - 1].right + layout.columnGap,
      0,
    );
  }
});

test('mobile and tablet navigation stacks without horizontal overflow', async ({
  page,
}) => {
  await page.goto('/about/');

  for (const { width, columns } of [
    { width: 390, columns: 1 },
    { width: 768, columns: 3 },
  ]) {
    await page.setViewportSize({ width, height: 900 });
    const nav = page.getByRole('navigation', { name: 'Primary' });
    const gridColumns = await nav
      .locator('ul')
      .evaluate(
        (element) =>
          window.getComputedStyle(element).gridTemplateColumns.split(' ')
            .length,
      );

    expect(gridColumns).toBe(columns);
    await expect(nav.getByRole('link')).toHaveCount(5);
    await expect(nav).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
