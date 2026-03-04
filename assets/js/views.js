(function () {
    const SUPABASE_URL = 'https://nxpdunqdgjcwavohmgrk.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_EFRsYxOQ6tiCySwac3laUQ_Buj0Us9M';

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        return;
    }

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    function getCurrentPagePath() {
        const hash = window.location.hash.replace('#', '').trim();
        if (hash) {
            return hash;
        }

        const path = window.location.pathname.split('/').pop();
        return path && path.length ? path : 'index.html';
    }

    function updateViewCounterDisplay(count) {
        const viewCountElem = document.getElementById('view-count');
        if (viewCountElem && Number.isFinite(Number(count))) {
            viewCountElem.textContent = String(count);
        }
    }

    async function incrementAndRender(pagePath) {
        const { data, error } = await client.rpc('increment_page_view', {
            p_page_path: pagePath
        });

        if (!error) {
            updateViewCounterDisplay(data);
            sessionStorage.setItem(`viewed:${pagePath}`, '1');
        }
    }

    async function loadCurrentCount(pagePath) {
        const { data, error } = await client
            .from('page_view_counts')
            .select('view_count')
            .eq('page_path', pagePath)
            .maybeSingle();

        if (!error && data && typeof data.view_count !== 'undefined') {
            updateViewCounterDisplay(data.view_count);
        }
    }

    async function trackViewOncePerSession() {
        const pagePath = getCurrentPagePath();
        const key = `viewed:${pagePath}`;

        if (sessionStorage.getItem(key)) {
            await loadCurrentCount(pagePath);
            return;
        }

        await incrementAndRender(pagePath);
    }

    window.addEventListener('DOMContentLoaded', trackViewOncePerSession);
    window.addEventListener('hashchange', trackViewOncePerSession);
})();
