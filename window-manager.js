var openedwindows = [];

function windowOnTop(window) {
    var index = openedwindows.indexOf(window);
    if (index > -1) {
        openedwindows.splice(index, 1);
    }
    openedwindows[openedwindows.length] = window;
    layerWindows();
}

function closeWindow(windowElement) {
    windowElement.style.setProperty("display", "none");
    windowElement.style.setProperty("z-index", 0);
    var index = openedwindows.indexOf(windowElement);
    if (index > -1) {
        openedwindows.splice(index, 1);
    }
    layerWindows();
}

function layerWindows() {
    for (var i = 0; i < openedwindows.length; ++i) {
        let currentWindow = openedwindows[i];

        currentWindow.style.setProperty("display", "flex");
        currentWindow.style.setProperty("z-index", i + 1);

        let interactiveElements = currentWindow.querySelectorAll(
            "input, textarea, button, a",
        );
        interactiveElements.forEach((el) => {
            el.setAttribute("tabindex", "-1");
        });
    }

    if (openedwindows.length > 0) {
        let topWindow = openedwindows[openedwindows.length - 1];

        let activeElements = topWindow.querySelectorAll(
            "input, textarea, button, a",
        );
        activeElements.forEach((el) => {
            el.setAttribute("tabindex", "0");
        });

        let firstInput = topWindow.querySelector("input, textarea");
        if (firstInput) {
            firstInput.focus();
        }
    }
}
