(function () {
    const SUPABASE_URL = 'https://nxpdunqdgjcwavohmgrk.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_EFRsYxOQ6tiCySwac3laUQ_Buj0Us9M';

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        window.contentData = {
            fetchQuotes: async () => [],
            fetchPortfolioItems: async () => [],
            renderQuotes: () => {},
            renderPortfolio: () => {}
        };
        return;
    }

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    function createElement(tagName, classNames) {
        const element = document.createElement(tagName);
        if (classNames) {
            element.className = classNames;
        }
        return element;
    }

    async function fetchQuotes() {
        const { data, error } = await client
            .from('quotes')
            .select('id, author, quote_text, sort_order, is_active')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching quotes:', error);
            return [];
        }

        return Array.isArray(data) ? data : [];
    }

    async function fetchPortfolioItems() {
        const { data, error } = await client
            .from('portfolio_items')
            .select('id, item_type, title, description, tag, date_label, image_src, image_alt, target_page, cert_link, cert_provider, sort_order, is_active')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching portfolio items:', error);
            return [];
        }

        return Array.isArray(data) ? data : [];
    }

    function renderQuotes(quotes) {
        const container = document.querySelector('.quote-motherdiv');
        if (!container) {
            return;
        }

        container.innerHTML = '';

        quotes.forEach((quote) => {
            const quoteUnit = createElement('div', 'quote-unit');
            quoteUnit.setAttribute('data-author', quote.author || 'Unknown');

            const authorWrapper = createElement('div', 'onepointone');
            const authorHeading = createElement('h4');
            authorHeading.textContent = quote.author || 'Unknown';
            authorWrapper.appendChild(authorHeading);

            const quoteWrapper = createElement('div', 'twopointtwo');
            const quoteText = createElement('p');
            quoteText.textContent = `"${quote.quote_text || ''}"`;
            quoteWrapper.appendChild(quoteText);

            quoteUnit.appendChild(authorWrapper);
            quoteUnit.appendChild(quoteWrapper);
            container.appendChild(quoteUnit);
        });
    }

    function buildProjectCard(item) {
        const card = createElement('div', 'mainunit project-card');
        card.setAttribute('data-type', 'project');

        if (item.target_page) {
            card.classList.add('project-link');
            card.setAttribute('data-page', item.target_page);
        }

        if (item.image_src) {
            const imageWrapper = createElement('div', 'divpic');
            const image = createElement('img');
            image.src = item.image_src;
            image.alt = item.image_alt || item.title || 'Project image';
            if ((item.image_src || '').toLowerCase().includes('.svg')) {
                image.classList.add('project-logo-image');
            }
            imageWrapper.appendChild(image);
            card.appendChild(imageWrapper);
        }

        const titleWrapper = createElement('div', 'onepointone');
        const titleHeading = createElement('h4');
        titleHeading.textContent = item.title || '';
        titleWrapper.appendChild(titleHeading);

        const body = createElement('div', 'twopointtwo');
        const description = createElement('p');
        description.textContent = item.description || '';
        body.appendChild(description);

        const metaRow = createElement('div', 'card-meta-row');
        const tagBadge = createElement('span', 'tag-badge');
        tagBadge.textContent = item.tag || '';
        const dateText = createElement('small', 'text-muted');
        dateText.textContent = item.date_label || '';
        metaRow.appendChild(tagBadge);
        metaRow.appendChild(dateText);

        body.appendChild(metaRow);
        card.appendChild(titleWrapper);
        card.appendChild(body);

        return card;
    }

    function buildComingSoonCard(item) {
        const card = createElement('div', 'mainunit coming-soon-card');
        card.setAttribute('data-type', 'project');

        const titleWrapper = createElement('div', 'onepointone');
        const titleHeading = createElement('h4');
        titleHeading.textContent = 'Coming Soon';
        titleWrapper.appendChild(titleHeading);

        const body = createElement('div', 'twopointtwo');
        const idea = createElement('p');
        idea.textContent = item.description || item.title || '';
        body.appendChild(idea);

        card.appendChild(titleWrapper);
        card.appendChild(body);

        return card;
    }

    function buildCourseCard(item) {
        const card = createElement('div', 'mainunit course-card');
        card.setAttribute('data-type', 'course');

        const titleWrapper = createElement('div', 'onepointone');
        const titleHeading = createElement('h4');
        titleHeading.textContent = item.title || '';
        titleWrapper.appendChild(titleHeading);

        const body = createElement('div', 'twopointtwo');
        const description = createElement('p');
        description.textContent = item.description || '';
        body.appendChild(description);

        const metaRow = createElement('div', 'card-meta-row');
        const tagBadge = createElement('span', 'tag-badge');
        tagBadge.textContent = item.tag || '';
        const dateText = createElement('small', 'text-muted');
        dateText.textContent = item.date_label || '';
        metaRow.appendChild(tagBadge);
        metaRow.appendChild(dateText);

        body.appendChild(metaRow);
        card.appendChild(titleWrapper);
        card.appendChild(body);

        return card;
    }

    function buildCertificateCard(item) {
        const card = createElement('div', 'mainunit certificate-card');
        card.setAttribute('data-type', 'certificate');

        const content = createElement('div', 'certificate-content');

        const iconWrapper = createElement('div', 'certificate-icon');
        const icon = createElement('i', 'text-blue-500');
        icon.setAttribute('data-feather', 'award');
        iconWrapper.appendChild(icon);

        const textWrapper = createElement('div');
        const titleHeading = createElement('h4');
        titleHeading.textContent = item.title || '';

        const provider = createElement('p');
        provider.textContent = item.cert_provider || item.description || '';

        textWrapper.appendChild(titleHeading);
        textWrapper.appendChild(provider);

        if (item.cert_link) {
            const link = createElement('a', 'view-cert');
            link.href = item.cert_link;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'View Certificate';
            textWrapper.appendChild(link);
        }

        content.appendChild(iconWrapper);
        content.appendChild(textWrapper);
        card.appendChild(content);

        return card;
    }

    function renderPortfolio(items) {
        const container = document.querySelector('.motherdiv');
        if (!container) {
            return;
        }

        container.innerHTML = '';

        const projects = [];
        const comingSoon = [];
        const courses = [];
        const certificates = [];

        items.forEach((item) => {
            if (item.item_type === 'project') {
                projects.push(item);
                return;
            }

            if (item.item_type === 'coming_soon') {
                comingSoon.push(item);
                return;
            }

            if (item.item_type === 'course') {
                courses.push(item);
                return;
            }

            if (item.item_type === 'certificate') {
                certificates.push(item);
            }
        });

        projects.forEach((item) => container.appendChild(buildProjectCard(item)));
        comingSoon.forEach((item) => container.appendChild(buildComingSoonCard(item)));
        courses.forEach((item) => container.appendChild(buildCourseCard(item)));
        certificates.forEach((item) => container.appendChild(buildCertificateCard(item)));

        if (window.feather && typeof window.feather.replace === 'function') {
            window.feather.replace();
        }
    }

    window.contentData = {
        fetchQuotes,
        fetchPortfolioItems,
        renderQuotes,
        renderPortfolio
    };
})();
