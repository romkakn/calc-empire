// Inline script: runs synchronously in <head> before paint to set data-theme.
// Prevents flash-of-wrong-theme on first paint.
//
// Reads cookie `theme` (system | light | dark). Falls back to system if unset
// or invalid. For system, consults matchMedia('(prefers-color-scheme: dark)').
//
// We deliberately bypass next/script here — both `beforeInteractive` and the
// default strategies run *after* the initial paint, which defeats the entire
// purpose (a flash of the wrong theme is the bug we're preventing). React 19's
// hoisting picks this up correctly when placed inside the layout's <head>.

const SCRIPT = `
(function(){try{
  var m=document.cookie.match(/(?:^|; )theme=(system|light|dark)/);
  var p=m?m[1]:"system";
  var d=p==="dark"||(p==="system"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme",d?"dark":"light");
  document.documentElement.setAttribute("data-theme-pref",p);
}catch(e){}})();
`.trim();

export function ThemeBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
