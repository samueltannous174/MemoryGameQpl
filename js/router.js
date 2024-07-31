const app = document.getElementById('app');

const routes = {
    '/': 'welcome',
    '/game': 'game',
    '/results': 'results'
};

function navigate(path) {
    window.history.pushState({}, path, window.location.origin + path);
    renderRoute();
}


function renderRoute() {
    const path = window.location.pathname;
    const view = routes[path] || 'welcome';
    loadView(view);
}

async function loadView(view) {
    if (view === "game" || view === "results"  ){
        const response = await fetch(`memoryGameQ+/views/${view}.html`);
        const html = await response.text();
        app.innerHTML = html
        const script = document.createElement('script');
        script.type = 'module';
        script.src = `memoryGameQ+/js/${view}.js`;
        document.body.appendChild(script);
        return
    }
    const response = await fetch(`views/${view}.html`);
    const html = await response.text();
    app.innerHTML = html
    const script = document.createElement('script');
    script.type = 'module';
    script.src = `js/${view}.js`;
    document.body.appendChild(script);
}

window.onpopstate = renderRoute;
renderRoute();

window.navigate = navigate;
