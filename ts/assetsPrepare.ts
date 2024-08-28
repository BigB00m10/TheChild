for (let group in window.Assets)
  if (group != "character")
    for (let asset in window.Assets[group])
      window.Assets[group][asset] = URL.createObjectURL(
        new Blob([window.Assets[group][asset]])
      );
