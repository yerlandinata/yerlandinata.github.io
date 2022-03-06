if ('serviceWorker' in navigator) {
    // Set the scope to an upper path of the script location
    // Response included "Service-Worker-Allowed : /"
    navigator.serviceWorker.register("/sw.js")
            .then((reg) => ""
                //console.log('service worker registered', reg.scope)
            )
            .catch((err) => console.log('service worker not registered', err))
}