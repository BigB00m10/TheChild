class PornMovie {
  show(name: string): void {
    $("#pornMovie").attr("src", window.Assets.pornMovie[name]);
  }
  names(): string[] {
    return Object.keys(window.Assets.pornMovie);
  }
}
