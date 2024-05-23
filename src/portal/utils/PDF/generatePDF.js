import { jsPDF } from "jspdf";
import "svg2pdf.js";

const WIDTH = 210;
const PADDING = 10;
const GUTTER = 1;
const MARGIN = 4;
const LABEL_WIDTH = 49;
const LABEL_HEIGHT = 12;
const INFO_CARD_BODY_HEIGHT = 75;
const HEADER_TEXT_RIGHT_SPACING = 41

export const generatePDF = async (infoRows, cards) => {
    const doc = new jsPDF();
    doc.setFont("roboto");


    // banner
    let y = PADDING;
    // await shadowImage(doc, "/img/agenda-1.png");
    const { y: imgY, height: imgHeight } = await addHeaderBanner(doc, y, "/img/skillmap-export-banner.png", "png");
    y = imgY

    doc.setFont('roboto', 'normal', '800')
    doc.setFontSize(20);
    doc.text(HEADER_TEXT_RIGHT_SPACING, y - (imgHeight / 2) + 2, doc.splitTextToSize('Self-assessment results: Twin transition Ninja Selfie', 120));
    doc.setFontSize(5);
    doc.setFont('roboto', 'normal', 'normal')


    y += MARGIN;

    // info rows
    infoRows.forEach((row) => {
        y = addInfoRow(doc, y, row.label, row.text);
        y += GUTTER;
    });
    y += MARGIN - GUTTER;

    // skill map
    y = await addSkillMap(doc, y);

    // info cards
    doc.addPage();

    // await shadowImage(doc, "/img/agenda-2.png");
    y = PADDING;
    const leftX = PADDING;
    const rightX = (WIDTH - 2 * PADDING - GUTTER) / 2 + PADDING + GUTTER;
    for (let i = 0; i < cards.length; i++) {
        // if (cards[i + 1]) {
        //   addInfoCard(doc, rightX, y, cards[i + 1].label, cards[i + 1].jobs, cards[i + 1].perText);
        // }
        if (i === 3) {
            doc.addPage();
            y = PADDING;
        }

        y = addInfoCard(doc, leftX, y, cards[i].label, cards[i].jobs, cards[i].perText);
        y += MARGIN;
    }
    doc.save("skillmap.pdf");
}

// async function shadowImage(doc, src) {
//   const image = await loadImage(src);
//   doc.addImage(image, "png", 0, 0, WIDTH, HEIGHT, src, "NONE", 0);
// }

async function loadImage(src) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            resolve(image);
        };
        image.src = src;
    });
}

async function addHeaderBanner(doc, y, src, format) {
    const image = await loadImage(src);
    const ratio = image.width / image.height;
    const width = WIDTH - 2 * PADDING;
    const height = width / ratio;
    doc.addImage(image, format, PADDING, PADDING, width, height, src, "NONE", 0);
    return { y: y + height, height };
}

function addInfoRow(doc, y, label, text) {
    doc.setTextColor("#000000");
    doc.setFontSize(13);
    doc.setFillColor("#4AD5ED");
    doc.rect(PADDING, y, LABEL_WIDTH, LABEL_HEIGHT, "F");
    doc.text(label, PADDING + 3, y + 8);
    doc.setFillColor("#FBFBFB");
    doc.rect(PADDING + LABEL_WIDTH + GUTTER, y, WIDTH - 2 * PADDING - LABEL_WIDTH - GUTTER, LABEL_HEIGHT, "F");
    doc.text(text, PADDING + LABEL_WIDTH + GUTTER + 3, y + 8);
    return y + LABEL_HEIGHT;
}

async function addSkillMap(doc, y) {
    document.querySelectorAll(".border-light").forEach((el) => {
        el.style.display = "none";
    });
    // const borderLight = ["#skill-13-1", "#skill-13-2", "#skill-13-3", "#skill-25-5", "#skill-25-6"];
    // borderLight.forEach((selector) => (document.querySelector(selector + " .border-light").style.display = "inline"));
    const element = document.querySelector(".skill-map svg");
    doc.setFillColor("#1b2439");
    doc.rect(PADDING, y, WIDTH - 2 * PADDING, WIDTH - 2 * PADDING - 34, "F");
    const width = WIDTH - 2 * PADDING - 6.5;
    const height = width - 42.5;

    await doc.svg(element, { x: PADDING + 2, y: y + 6.5, width, height });
    // await doc.addSvg(element.outerHTML, (PADDING + 2), (y + 6.5), width, height);
    addButtons(doc, y);
    document.querySelectorAll(".border-light").forEach((el) => {
        el.style.display = "inline";
    });
    return y + height;
}

function addButtons(doc, y) {
    doc.setFontSize(5);
    const buttons = [
        { x: 94, y: 5.5 },
        { x: 126.5, y: 10.5 },
        { x: 150, y: 26 },
        { x: 167, y: 48 },
        { x: 173, y: 75 },
        { x: 167, y: 102 },
        { x: 150, y: 124 },
        { x: 126.5, y: 139.5 },
        { x: 94, y: 144.5 },
        { x: 94 + 94 - 126.5, y: 139.5 },
        { x: 94 + 94 - 150, y: 124 },
        { x: 94 + 94 - 167, y: 102 },
        { x: 94 + 94 - 173, y: 75 },
        { x: 94 + 94 - 167, y: 48 },
        { x: 94 + 94 - 150, y: 26 },
        { x: 94 + 94 - 126.5, y: 10.5 },
    ];
    document.querySelectorAll(".skill-map-step span").forEach((button, index) => {
        const bx = buttons[index].x;
        const by = buttons[index].y;
        doc.setFillColor("#20283A");
        doc.roundedRect(bx, y + by, 20, 4, 0.8, 0.8, "F");
        doc.setTextColor("#869dc8");
        doc.text(ellipsis(doc, button.innerHTML), bx + 10, y + by + 2.5, { align: "center" });
    });
}

function ellipsis(doc, text) {
    let overflow = false;
    while (doc.getTextWidth(text) > 18) {
        text = text.slice(0, -1);
        overflow = true;
    }
    return overflow ? text + "..." : text;
}

function addInfoCard(doc, x, y, label, jobs = null, perText = '') {
    doc.setTextColor("#000000");
    doc.setFontSize(16);
    const width = (WIDTH - 2 * PADDING - GUTTER);
    doc.setFillColor("#4AD5ED");
    doc.rect(x, y, width, LABEL_HEIGHT, "F");
    doc.setFont('roboto', 'bold')
    doc.text(x + 3, y + 8, label)
    doc.setFont('roboto', 'normal')
    doc.setFillColor("#FBFBFB");
    doc.rect(x, y + LABEL_HEIGHT + GUTTER, width, INFO_CARD_BODY_HEIGHT, "F");


    if (jobs) {
        doc.setFontSize(14);
        let startMargin = 20

        let index = 0
        jobs.forEach((item) => {
            var splitTitle = doc.splitTextToSize(`${item.title}${item.seniority ? `: ${item.seniority}` : ''}`, 170);
            splitTitle.forEach((item, ind) => {
                if (ind === 0) {
                    doc.setFont("Zapfdingbats");
                    doc.setFontSize(8);
                    doc.text(x + 3, y + startMargin - 0.7 + ((index) * 6), '\\154');
                    doc.setFont("roboto");
                    doc.setFontSize(14);
                }
                doc.text(x + 8, y + startMargin + ((index) * 6), item);

                index++
            })
        })
        perText && doc.text(x + 3, y + startMargin + 1 + ((index) * 6), doc.splitTextToSize(perText, 170));
    }

    return y + LABEL_HEIGHT + GUTTER + INFO_CARD_BODY_HEIGHT;
}
