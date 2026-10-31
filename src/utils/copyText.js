// 非安全來源（如區網 http）沒有 navigator.clipboard，改用 execCommand 備案
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 選取暫存 textarea 會搶走焦點，結束後還給原本的元素（通常是複製按鈕）
    const previousFocus = document.activeElement;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    } finally {
      document.body.removeChild(textarea);
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus({ preventScroll: true });
      }
    }
    return ok === true;
  }
}
