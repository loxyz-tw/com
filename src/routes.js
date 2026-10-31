export function isPhp2ShellPath(pathname) {
  const withoutIndex = pathname.replace(/\/index\.html$/, '');
  const normalized = withoutIndex.replace(/\/$/, '');
  return normalized === '/services/php2shell';
}
