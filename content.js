// Content script to interact with Oracle cloud page
let computeWindow, createBtn, contentsElmt, headerElmt, adElmts;
let isPaused = true;
let INTERVAL_DURATION = 30;
let countdown, sessionWindow;

// Track AD selection
let lastAd = 0;
let adList = [];

function initializeElements() {
    computeWindow = document.querySelector("#compute-wrapper")
        ? window
        : document.querySelector("#sandbox-compute-container")?.contentWindow;

    if (!computeWindow) {
        console.error("Failed to find iframe window");
        return false;
    }

    createBtn = computeWindow.document.querySelector(".oui-savant__Panel--Footer .oui-button.oui-button-primary");
    contentsElmt = computeWindow.document.querySelector(".oui-savant__Panel--Contents");
    headerElmt = computeWindow.document.querySelector(".oui-savant__Panel--Header");
    adElmts = computeWindow.document.querySelectorAll(".oui-savant__card-radio-option");

    if (!createBtn || createBtn.textContent !== "Create") {
        console.error("Failed to find 'Create' button");
        return false;
    }

    if (!contentsElmt || !headerElmt) {
        console.error("Failed to find contents or header element");
        return false;
    }

    return true;
}

function createStatusBar() {
    statusElmt = document.createElement("div");
    statusElmt.setAttribute("style", `
        z-index: 9999999999999;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: white;
        background-color: #00688c;
        box-shadow: 0px 0px 10px -4px black;
        white-space: break-spaces;
    `);

    function setStatusHeight() {
        statusElmt.style.height = `${headerElmt.clientHeight}px`;
    }

    setStatusHeight();
    computeWindow.addEventListener("resize", setStatusHeight);
    contentsElmt.prepend(statusElmt);
}

function currentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function logMessage(message, color = "#7cde6f") {
    console.log(
        `%c *** ${message} *** `,
        `background-color: #222; color: ${color};`
    );
}

function findAvailabilityDomainElement(adName) {
    const matchedAD = Array.from(adElmts).find(el => 
        el.textContent.trim().includes(adName)
    );
    return matchedAD;
}

function tryNextAvailabilityDomain() {
    if (adList.length > 0) {
        const currentAdElement = findAvailabilityDomainElement(adList[lastAd]);
        if (currentAdElement) {
            currentAdElement.click();
            lastAd = (lastAd + 1) % adList.length; 
        }
    }
}

function updateStatusDisplay() {
    if (!statusElmt) return;

    if (isPaused) {
        statusElmt.style.backgroundColor = "#ff4d4d";
        statusElmt.innerHTML = "PAUSED";
    } else {
        statusElmt.style.backgroundColor = "#00688c";
        statusElmt.innerHTML = `Clicking in <b>${countdown} seconds</b>`;
    }
}

function startScript() {
    if (!initializeElements()) return;
    createStatusBar();

    const intervalId = setInterval(() => {
        if (countdown > 0) {
            updateStatusDisplay();
            countdown--;
            return;
        }

        if (!isPaused) {
            tryNextAvailabilityDomain();
            createBtn.click();

            statusElmt.style.backgroundColor = "#44bd50";
            statusElmt.innerHTML = `Create clicked!`;

            logMessage(`Clicked 'Create' at ${currentTime()}`);

            countdown = Math.round(INTERVAL_DURATION);
        }
    }, 1000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateInterval') {
        INTERVAL_DURATION = request.duration;
        countdown = Math.round(INTERVAL_DURATION);
    } else if (request.action === 'startScript') {
        // Ensure we're on the correct page before starting
        if (!window.location.href.includes('cloud.oracle.com')) {
            sendResponse({ started: false });
            return;
        }

        // Set up ADs
        adList = [request.ad1, request.ad2].filter(ad => ad);
        
        // Start script
        isPaused = false;
        countdown = Math.round(INTERVAL_DURATION);
        
        // Open session window only when starting
        sessionWindow = window.open(
            "https://cloud.oracle.com",
            "_blank",
            "height=400,width=400;popup=true"
        );

        startScript();
        sendResponse({ started: true });
    } else if (request.action === 'togglePause') {
        isPaused = true;
        sendResponse({ paused: true });
    }
    return true;
});

// No auto-start, just initialization
if (window.location.href.includes('cloud.oracle.com')) {
    initializeElements();
    createStatusBar();
}
