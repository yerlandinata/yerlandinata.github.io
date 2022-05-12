function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class BookView {
    /**
     * @param {string} fileName 
     */
    constructor(fileName, password) {
        this.fileName = fileName;
        this.password = password;
        this.loadBook().then((book) => this.onBookLoaded(book));
        this.currentPageNumber = 0;
        this.currentSection = 0;
        /** @type {JQuery<HTMLElement>[]} */
        this.pages = [];
        this.screenDimensions = `${$(window).height()}x${$(window).width()}`;
        this.touchStartY = NaN;
    }

    /**
     * @returns {Promise<Ebook.Book>}
     */
    async loadBook() {
        const response = await fetch(this.fileName);
        if (this.password) {
            const cipherText = await response.text();
            try {
                const decrypted = CryptoJS.AES.decrypt(cipherText, this.password).toString(CryptoJS.enc.Utf8);
                localStorage.setItem(this.fileName + '_password', this.password);
                return JSON.parse(decrypted);
            } catch (error) {
                alert('wrong password')
            }
        }
        return response.json();
    }

    isMobile() {
        return $(window).width() < $(window).height() && $(window).width() < 500;
    }

    getLastPageProgressStorageKey() {
        return `${this.fileName}_${this.screenDimensions}_page_progress`;
    }

    getPageStructureStorageKey() {
        return `${this.fileName}_${this.screenDimensions}_page_structure`;
    }

    getHighlightedStorageKey() {
        return this.fileName + '_highlights';
    }

    /**
     * @param {Ebook.Book} book 
     */
    async onBookLoaded(book) {
        console.log('begin render on:', new Date());
        this.book = book;
        /** @type {Set<string>} */
        this.highlights = localStorage.getItem(this.getHighlightedStorageKey());
        if (!this.highlights) {
            this.highlights = new Set();
        } else {
            this.highlights = new Set(JSON.parse(this.highlights));
        }

        $('main').empty();
        const stylesheets = this.cleanStylesheets(this.book.stylesheets.join('\n'));
        $('#stylesheets').text(stylesheets);

        if (localStorage.getItem(this.getPageStructureStorageKey())) {
            await this.renderBookFromCache();
        } else {
            await this.renderBook();
        }

        this.bindEvents();
        $('.page-container').css('visibility', 'visible');
        $('.page-container').hide();
        $('nav button').show();
        if (localStorage.getItem(this.getLastPageProgressStorageKey())) {
            this.currentPageNumber = parseInt(localStorage.getItem(this.getLastPageProgressStorageKey()));
        }
        this.onPageChanged();
        this.renderHighlights();
        $('.loading').hide();
        console.log('finish render on:', new Date());
        $('body').on('click', () => $('body')[0].requestFullscreen())
    }

    bindEvents() {
        $('#nav-prev').on('click', () => {
            if ($('nav').css('opacity') == 0) {
                return;
            }
            this.onPrevPageButtonClick()
        });
        $('#nav-next').on('click', () => {
            if ($('nav').css('opacity') == 0) {
                return;
            }
            this.onNextPageButtonClick()
        });
        $('#nav-reset').on('click', () => {
            if ($('nav').css('opacity') == 0) {
                return;
            }
            this.reset()
        });
        $(document).on('keyup', (e) => {
            if (e.keyCode == '38') {
                this.onPrevPageButtonClick();
            } else if (e.keyCode == '40' || e.keyCode == '32') {
                this.onNextPageButtonClick();
            }
        });
        $('.text-paragraph').on('dblclick', (e) => this.onParagraphDoubleClicked(e));
        $('.page-container').on('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        });
        $('.page-container').on('touchend', (e) => {
            if (isNaN(this.touchStartY)) {
                return;
            }
            const endY = e.changedTouches[0].clientY;
            if (endY - this.touchStartY > 50) {
                this.onPrevPageButtonClick();
            } else if (endY - this.touchStartY < -50) {
                this.onNextPageButtonClick();
            }
            this.touchStartY = NaN;
        });
        $('nav').on('touchend', (e) => {
            setTimeout(() => $('nav').css('opacity', 1), 300);
            setTimeout(() => $('nav').css('opacity', 0), 3000);
        })
    }

    reset() {
        localStorage.clear();
        location.reload();
    }


    /**
     * 
     * @param {JQuery.DoubleClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>} event 
     */
    onParagraphDoubleClicked(event) {
        const id = event.target.getAttribute('id');
        if (this.highlights.has(id)) {
            this.highlights.delete(id);
        } else {
            this.highlights.add(id);
        }
        localStorage.setItem(this.getHighlightedStorageKey(), JSON.stringify(Array.from(this.highlights)));
        this.renderHighlights();
    }

    renderHighlights() {
        $('.text-paragraph').removeClass('highlighted');
        this.highlights.forEach((id) => $(`#${id}`).addClass('highlighted'));
    }

    async renderBookFromCache() {
        console.log('rendering book from cache');
        /** @type {string[][]} */
        const pageParagraphs = JSON.parse(localStorage.getItem(this.getPageStructureStorageKey()));
        const tempContainer = $('<div></div>');
        for (let i = 0; i < this.book.texts.length; i++) {
            tempContainer.append($.parseHTML(this.book.texts[i]));
        }
        $('#loading-progress').attr('max', pageParagraphs.length);
        $('#loading-progress').attr('value', 0);
        for (let i = 0; i < pageParagraphs.length; i++) {
            this.pushEmptyPage();
            for (let j = 0; j < pageParagraphs[i].length; j++) {
                this.pages[i].append(tempContainer.find(`#${pageParagraphs[i][j]}`));
            }
            this.renderImages(this.pages[i]);
            if (i % 100 == 0) {
                $('#loading-progress').attr('value', i);
                await timeout(0);
            }
        }
    }

    async renderBook() {
        console.log('rendering book from scratch');
        $('#loading-progress').attr('max', this.book.texts.length);
        $('#loading-progress').attr('value', 0);
        for (let i = 0; i < this.book.texts.length; i++) {
            $('#loading-progress').attr('value', i);
            await this.renderSectionFromHtmlStr(this.book.texts[i]);
            await timeout(0);
        }
        const pageParagraphs = this.pages.map((page) => {
            const paragraphs = [];
            page.children().each((_, paragraph) => paragraphs.push(paragraph.getAttribute('id')));
            return paragraphs;
        });
        localStorage.setItem(this.getPageStructureStorageKey(), JSON.stringify(pageParagraphs));
    }

    /**
     * @param {JQuery<HTMLElement>} page 
     */
    async prettifyImage(page) {
        if (page.children().length == 1 && page.children()[0].nodeName == 'IMG') {
            const img = page.children()[0];
            if (this.isMobile()) {
                page.css('display', 'flex');
                page.css('flex-direction', 'column');
                page.css('justify-content', 'center');
                page.css('align-items', 'center');
                $(img).css('max-width', '100%');
                // if ((await this.isImageTooTall(img))) {

                // } else {
                // }
            } else {
                $(img).css('max-height', '100%');
                page.css('width', 'fit-content');
            }
        }
    }

    onPrevPageButtonClick() {
        this.currentPageNumber = Math.max(0, this.currentPageNumber - 1);
        this.onPageChanged();
    }

    onNextPageButtonClick() {
        this.currentPageNumber = Math.min(this.pages.length - 1, this.currentPageNumber + 1);
        this.onPageChanged();
    }

    onPageChanged() {
        this.pages.forEach((page) => page.hide());
        this.pages[this.currentPageNumber].show();
        $('#nav-pagenum').text(this.currentPageNumber);
        if (this.currentPageNumber == 0) {
            $('#nav-prev').css('visibility', 'hidden');
        } else {
            $('#nav-prev').css('visibility', 'visible');
        }
        if (this.currentPageNumber == this.pages.length - 1) {
            $('#nav-next').css('visibility', 'hidden');
        } else {
            $('#nav-next').css('visibility', 'visible');
        }
        localStorage.setItem(this.getLastPageProgressStorageKey(), this.currentPageNumber);
        this.prettifyImage(this.pages[this.currentPageNumber]);
    }

    /**
     * @param {string} sectionHtml 
     */
    async renderSectionFromHtmlStr(sectionHtml) {
        // await this.renderSection($.parseHTML(sectionHtml));
        const section = $(sectionHtml);
        section.addClass('page-container');
        let currentPage = this.pushEmptyPage();
        $('main').append(section);
        await timeout(150);
        await this.renderImages(section);
        section.detach();
        const bottomLine = currentPage.offset().top + currentPage.innerHeight() - parseInt(currentPage.css('padding-bottom'));
        let imgInPage = false;
        section.children().each((_, child) => {
            if (child.nodeName == 'IMG') {
                if (currentPage.children().length > 0) {
                    currentPage = this.pushEmptyPage();
                }
                currentPage.append($(child));
                imgInPage = true;
            } else {
                if (imgInPage) {
                    currentPage = this.pushEmptyPage();
                    imgInPage = false;
                }
                const paragraph = $(child);
                currentPage.append(paragraph);
                const bottom = $(paragraph).offset().top + $(paragraph).outerHeight();
                if (bottom > bottomLine) {
                    paragraph.detach();
                    currentPage = this.pushEmptyPage();
                    currentPage.append($(child));
                    if ($(currentPage.children()[0]).offset().top + $(currentPage.children()[0]).outerHeight() > bottomLine) {
                        alert(`warning: ${$(currentPage.children()[0]).attr('id')} is overflowing page!`);
                        console.warn(`warning: ${$(currentPage.children()[0]).attr('id')} is overflowing page!`);
                    }
                }
            }
        });
    }

    /**
     * @param {JQuery<HTMLElement>} sectionElement
     */
    async renderSection(sectionElement) {
        this.pushEmptyPage();
        const currentPage = this.pages[this.pages.length - 1];
        currentPage.append(sectionElement);
        if (currentPage.find('> *').length == 1) {
            const onlyChild = currentPage.find('> *');
            onlyChild.find('> *').each((_, element) => currentPage.append(element));
            onlyChild.remove();
        }
        $('main').append(currentPage);
        this.renderImages(currentPage);
        await this.wrapPage(currentPage);
    }

    /**
     * @param {JQuery<HTMLElement>} page 
     */
    async wrapPage(page) {
        await timeout(150);
        const next = $('<div></div>');
        const bottomLine = page.offset().top + page.innerHeight() - parseInt(page.css('padding-bottom'));
        let forceBreak = false;
        page.find('> *').each((i, element) => {
            if (element.nodeName == 'IMG' && $(element).height() > 200) {
                forceBreak = true;
                if (i != 0) {
                    next.append($(element).detach());
                }
            }
            if (forceBreak && element.nodeName != 'IMG') {
                next.append($(element).detach());
                return;
            }
            if ($(element).outerHeight() > page.innerHeight()) {
                return;
            }
            const bottom = $(element).offset().top + $(element).outerHeight();
            if (bottom >= bottomLine) {
                next.append($(element).detach());
            }
        });
        if (next.children().length > 0) {
            await this.renderSection(next);
        }
    }

    /**
     * @param {JQuery<HTMLElement>} page 
     */
    async renderImages(page) {
        
        // img
        page.find('img').each((_, img) => {
            const isRendered = img.getAttribute('data-is-rendered');
            if (isRendered == 'true') {
                return;
            }
            const src = img.getAttribute('src');
            const imageType = this.getImageType(src);
            const imageId = this.getImageId(src);
            if (!imageId || !imageType) {
                return;
            }
            img.setAttribute('src', `data:image/${imageType};base64, ${this.book.images[imageId]}`);
        });
        // svg
        page.find('svg image').each((_, image) => {
            const href = image.getAttribute('href');
            const imageId = this.getImageId(href);
            const imageType = this.getImageType(href);
            if (!imageId || !imageType) {
                console.log('undefined image!');
                return;
            }
            const parentSvg = $(image).parent();
            parentSvg.detach();
            const imageBase64 = this.book.images[imageId];
            if (!imageBase64) {
                console.log('undefined image!');
                return;
            }
            page.append($(`<img id=${parentSvg.attr('id')} src='data:image/${imageType};base64, ${imageBase64}'>`));
        });

        const pageImgs = page.find('img');
        for (let i = 0; i < pageImgs.length; i++) {
            const img = pageImgs[i];
            const isRendered = img.getAttribute('data-is-rendered');
            if (isRendered == 'true') {
                continue;
            }
            const parent = $(img).parent();
            const imageDimensions = await this.getImageSize(img);
            if ((parent.prop('tagName') == 'P' || parent.prop('tagName') == 'H1') && imageDimensions.height > 200) {
                const parentId = parent.attr('id');
                parent.attr('id', parentId + '_');
                $(img).attr('id', parentId);
                parent.replaceWith($(img));
                parent.attr('data-is-rendered', 'true');
            } else {
                $(img).attr('data-is-rendered', 'true');
            }
        }
    }

    /**
     * @param {HTMLImageElement} img
     * @returns {Promise<boolean>}
     */
    async isImageTooTall(img) {
        const size = await this.getImageSize(img);
        return (size.height / size.width) > 2;
    }

    /**
     * @param {HTMLImageElement} img
     * @returns {Promise<{width: number, height: number}>}
     */
    async getImageSize(img) {
        const image = await IJS.Image.load(img.src);
        return { width: image.width, height: image.height };
    }

    /**
     * @param {string} url 
     */
    getImageId(url) {
        const split1 = url.split('/');
        const last1 = split1[split1.length - 1];
        const split2 = last1.split('\\');
        return split2[split2.length - 1];
    }

    pushEmptyPage() {
        const page = $('<div></div>');
        page.addClass('page-container');
        this.pages.push(page);
        $('main').append(page);
        return page;
    }

    /**
     * @param {string} stylesheets 
     */
    cleanStylesheets(stylesheets) {
        return stylesheets
            .replace(/body\{[^\{]*\}/g, '')
            .replace(/img\{[^\{]*\}/g, '')
            .replace(/html\{[^\{]*\}/g, '');
    }

    /**
     * @param {string} url 
     */
    getImageType(url) {
        const knownTypes = [
            'jpg',
            'jpeg',
            'gif',
            'png',
            'svg',
        ];
        for (let i = 0; i < knownTypes.length; i++) {
            if (url.includes('.' + knownTypes[i])) {
                return knownTypes[i];
            }
        }
        return undefined;
    }
}

const library = {
    12: 'elite10.json.encrypted',
    13: 'elite11.json.encrypted',
    14: 'elite11.5.json.encrypted',
    15: 'elite2_01.json.encrypted',
    16: 'elite2_02.json.encrypted',
    17: 'elite2_03.json.encrypted',
    18: 'elite2_04.json.encrypted',
    19: 'elite2_04.5.json.encrypted',
    20: 'elite2_05.json.encrypted',
};

const params = (new URL(document.location)).searchParams;

const volume = parseInt(params.get('vol'));

if (!library[volume]) {
    alert('volume not found!');
    $('body').detach();
    throw new Error("volume not found!");
}
let password;
if (library[volume].includes('encrypted')) {
    password = prompt('password:', this.localStorage.getItem(library[volume] + '_password') || '')
}

const view = new BookView(library[volume], password);
/**
 * 
 
 */