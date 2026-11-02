// The CSS Playground's data. Each property: what it does, when to use it, and values to cycle through,
// each with a line saying what you see. demo = which small page it runs on (playground.js).
//   on: 'parent' means the rule goes on the box that holds the items, not on the items.
//   ex = which value the list at the bottom shows (default: the second)
//   base = CSS the demo needs so the property has something to show (not part of the lesson).
window.CSS_PROPERTIES = [
  // ---------------------------------------------------------------- Text
  { name: 'color', group: 'Text', demo: 'text', what: 'The colour of the text.', use: 'Any text. Names, hex or rgb all work.', values: [
    ['#1b2230', 'A very dark blue, softer on the eyes than pure black.'], ['crimson', 'A named colour. There are about 140 names.'], ['#2a75bb', 'Hex: pairs of digits for red, green and blue.'], ['rgb(19, 121, 91)', 'The same idea as hex, written as three numbers from 0 to 255.'], ['hsl(270, 50%, 40%)', 'Hue (a spot on the colour wheel, 0 to 360), saturation, lightness.'], ['rgb(102, 51, 153, 0.5)', 'A 4th value makes it see-through: 0 is invisible, 1 is solid.']], tip: 'It is spelled color, the American way. colour does nothing.' },
  { name: 'font-size', group: 'Text', demo: 'text', ex: 2, what: 'How big the text is.', use: 'Headings and body text. Prefer rem, so it follows the size the user chose.', values: [
    ['12px', 'Fixed size: small print.'], ['1rem', '1 × the browser text size: usually 16px.'], ['1.5rem', '1.5 × the browser text size: usually 24px.'], ['2.5rem', '2.5 × the browser text size: usually 40px.']] },
  { name: 'font-family', group: 'Text', demo: 'text', what: 'Which font the text uses.', use: 'Usually once, on body. List fallbacks, because the browser uses the first font it has.', values: [
    ['sans-serif', 'No little feet on the letters. The usual choice for screens.'], ['serif', 'Little feet on the letters, like a printed book.'], ['monospace', 'Every letter is the same width, like code.']], tip: 'Font names with spaces need quotes: "Times New Roman", serif.' },
  { name: 'font-weight', group: 'Text', demo: 'text', what: 'How thick the letters are.', use: 'Make words stand out. If the word really matters, use <strong> in the HTML instead.', values: [
    ['normal', 'Regular text (same as 400).'], ['bold', 'Thick letters (same as 700).']] },
  { name: 'font-style', group: 'Text', demo: 'text', what: 'Italic or not.', use: 'For looks only. For real emphasis use <em> in the HTML.', values: [
    ['normal', 'Upright letters.'], ['italic', 'Slanted letters.']] },
  { name: 'text-align', group: 'Text', demo: 'text', what: 'Lines the text up inside its box.', use: 'Centre headings and buttons. Long text reads best on the left.', values: [
    ['left', 'Lined up on the left.'], ['center', 'In the middle of the box.'], ['right', 'Lined up on the right.']], tip: 'It moves the text inside the box, not the box itself. To centre a box use margin: 0 auto.' },
  { name: 'text-decoration', group: 'Text', demo: 'text', what: 'Lines on the text.', use: 'Most often to remove the underline from links: text-decoration: none.', values: [
    ['none', 'No line.'], ['underline', 'A line under the text.'], ['line-through', 'Crossed out, like a finished to-do item.']] },
  { name: 'text-transform', group: 'Text', demo: 'text', what: 'Changes capital letters without changing the HTML.', use: 'Buttons and small titles.', values: [
    ['none', 'As it is written in the HTML.'], ['uppercase', 'ALL CAPITALS.'], ['lowercase', 'all small letters.'], ['capitalize', 'The First Letter Of Each Word.']] },
  { name: 'line-height', group: 'Text', demo: 'text', what: 'The space between lines of text.', use: 'Paragraphs. About 1.5 is easy to read.', values: [
    ['1', 'Lines almost touch: hard to read.'], ['1.5', '1.5 × the font size: comfortable.'], ['2.5', 'Very open.']], tip: 'A number with no unit scales with the font size.' },
  { name: 'letter-spacing', group: 'Text', demo: 'text', what: 'The space between letters.', use: 'Small titles in capitals.', values: [
    ['normal', 'As the font designed it.'], ['2px', 'A little extra space.'], ['6px', 'Very spread out.']] },

  // ---------------------------------------------------------------- Colour
  { name: 'background-color', group: 'Colour', demo: 'box', what: 'The colour behind the content and the padding.', use: 'Cards, buttons, whole sections.', values: [
    ['white', 'A named colour.'], ['#ffcb05', 'Hex yellow.'], ['#2a75bb', 'Hex blue. Check the text is still easy to read.']] },
  { name: 'background-image', group: 'Colour', demo: 'box', what: 'A picture or a gradient behind the content.', use: 'Gradients, or url("picture.jpg") for an image.', values: [
    ['none', 'No image: the background colour shows.'], ['linear-gradient(#ffcb05, #2a75bb)', 'Top to bottom, from yellow to blue.'], ['linear-gradient(to right, #ffcb05, #c62828)', 'Left to right, from yellow to red.']] },
  { name: 'opacity', group: 'Colour', demo: 'box', what: 'How see-through the whole box is.', use: 'Disabled buttons, hover effects.', values: [
    ['1', 'Solid.'], ['0.6', '60% solid: you start to see through it.'], ['0.2', 'Nearly invisible.']], tip: 'It fades the box and everything inside it, text included.' },
  { name: 'box-shadow', group: 'Colour', demo: 'box', what: 'A shadow around the box.', use: 'Makes a card look lifted off the page.', values: [
    ['none', 'No shadow.'], ['0 2px 6px rgb(0 0 0 / 0.4)', 'A soft, small shadow: across 0, down 2px, blur 6px, then the colour.'], ['8px 8px 0 #2a75bb', 'A hard shadow: no blur, moved 8px across and 8px down.']] },

  // ---------------------------------------------------------------- Box
  { name: 'width', group: 'Box', demo: 'box', what: 'How wide the box is.', use: 'Px for fixed sizes, % to follow the parent.', values: [
    ['100px', 'Fixed: 100px on any screen.'], ['50%', 'Half of the parent box.'], ['100%', 'As wide as the parent.']] },
  { name: 'height', group: 'Box', demo: 'box', what: 'How tall the box is.', use: 'Rarely needed: most boxes grow to fit their content, which is safer.', values: [
    ['auto', 'As tall as the content needs.'], ['60px', 'Fixed: 60px.'], ['150px', 'Fixed: 150px.']] },
  { name: 'max-width', group: 'Box', demo: 'box', base: 'width: 100%;', what: 'The widest the box may get.', use: 'Stops text getting too wide on big screens, and still shrinks on phones.', values: [
    ['none', 'No limit: it fills the parent.'], ['300px', 'Never wider than 300px, narrower if the screen is.'], ['50%', 'Never wider than half the parent.']] },
  { name: 'padding', group: 'Box', demo: 'box', what: 'Space inside the border, around the content.', use: 'Keep text off the edge of a card or button. It takes the background colour.', values: [
    ['0', 'The text touches the edge.'], ['16px', 'All four sides.'], ['8px 32px', 'Two values: top and bottom, then left and right.'], ['0 0 40px 0', 'Four values: top, right, bottom, left (clockwise).']] },
  { name: 'margin', group: 'Box', demo: 'box', base: 'width: 200px;', what: 'Space outside the border, between boxes.', use: 'Push boxes apart. It is always see-through.', values: [
    ['0', 'No space around the box.'], ['24px', 'All four sides.'], ['0 auto', 'None top and bottom. Left and right share the free space: this centres a box.']], tip: 'Centring with auto needs a width smaller than the parent.' },
  { name: 'border', group: 'Box', demo: 'box', what: 'A line around the box.', use: 'Three parts: width, style, colour.', values: [
    ['none', 'No line.'], ['2px solid #1b2230', 'A thin solid line.'], ['6px dashed #c62828', 'A thick dashed line.'], ['4px dotted #2a75bb', 'A dotted line.']], tip: 'Leave out the style (solid) and no line appears.' },
  { name: 'border-radius', group: 'Box', demo: 'box', what: 'Rounds the corners.', use: 'Cards and buttons. A large value on a square makes a circle.', values: [
    ['0', 'Square corners.'], ['8px', 'Slightly rounded.'], ['30px', 'Very round.']] },
  { name: 'box-sizing', group: 'Box', demo: 'box', base: 'width: 200px; padding: 24px; border: 8px solid #2a75bb;', what: 'Decides whether width includes the padding and border.', use: 'Set border-box on everything. Almost every site does.', values: [
    ['content-box', 'The default: width 200px + padding + border makes it 264px wide.'], ['border-box', 'The width stays 200px: padding and border fit inside it.']] },

  // ---------------------------------------------------------------- Layout
  { name: 'display', group: 'Layout', demo: 'items', what: 'How a box takes part in the layout.', use: 'Turn inline things into blocks, or hide something completely.', values: [
    ['block', 'Each box starts a new line and takes the full width.'], ['inline', 'Side by side, like words. Width and height are ignored.'], ['inline-block', 'Side by side, and width and height still work.'], ['none', 'Gone: it takes up no space at all.']] },
  { name: 'position', group: 'Layout', demo: 'pos', what: 'Moves a box away from its normal place.', use: 'Badges on a card, menus. Then top, left, right and bottom say where.', values: [
    ['static', 'The default: top and left are ignored.'], ['relative', 'Moves from its normal spot. Its old space stays empty.'], ['absolute', 'Measured from the nearest positioned parent. The others close the gap.']], tip: 'fixed sticks to the window while you scroll; sticky sticks once you scroll to it.' },
  { name: 'z-index', group: 'Layout', demo: 'layers', what: 'Which box sits on top when boxes overlap.', use: 'Menus and pop-ups. It only works on positioned boxes.', values: [
    ['0', 'Lower than the blue box (1): it sits behind.'], ['2', 'Higher than the blue box (1): it comes to the front.']] },
  { name: 'overflow', group: 'Layout', demo: 'scroll', what: 'What happens when the content is bigger than the box.', use: 'Scrolling panels, or cropping an image.', values: [
    ['visible', 'The default: the text spills out of the box.'], ['hidden', 'The extra text is cut off.'], ['auto', 'A scrollbar appears when it is needed.']] },

  // ---------------------------------------------------------------- Flex and grid
  { name: 'flex-direction', group: 'Flex and grid', demo: 'row', on: 'parent', what: 'Which way the items run.', use: 'Rows on a desktop, columns on a phone.', values: [
    ['row', 'Left to right.'], ['column', 'Top to bottom.'], ['row-reverse', 'Right to left.']] },
  { name: 'justify-content', group: 'Flex and grid', demo: 'row', on: 'parent', what: 'Spreads the items along the main direction.', use: 'Menus: logo on the left, links on the right.', values: [
    ['flex-start', 'All at the start.'], ['center', 'All in the middle.'], ['flex-end', 'All at the end.'], ['space-between', 'First and last at the edges, the rest spread out.']] },
  { name: 'align-items', group: 'Flex and grid', demo: 'row', on: 'parent', base: 'height: 170px;', what: 'Lines the items up across the other direction.', use: 'Centre things vertically in a row.', values: [
    ['stretch', 'The default: items fill the height.'], ['flex-start', 'At the top.'], ['center', 'In the middle.'], ['flex-end', 'At the bottom.']] },
  { name: 'flex-wrap', group: 'Flex and grid', demo: 'wide', on: 'parent', what: 'Whether items may move to a new line.', use: 'Rows of cards that should fit any screen.', values: [
    ['nowrap', 'The default: everything squeezes onto one line.'], ['wrap', 'Items that do not fit move to the next line.']] },
  { name: 'gap', group: 'Flex and grid', demo: 'row', on: 'parent', what: 'The space between flex or grid items.', use: 'Simpler than a margin on every item: no extra space at the edges.', values: [
    ['0', 'Items touch.'], ['1rem', 'About 16px between items.'], ['3rem', 'About 48px between items.']] },
  { name: 'grid-template-columns', group: 'Flex and grid', demo: 'grid', on: 'parent', what: 'The columns of a grid. Needs display: grid on the same box.', use: 'Page layouts and rows of equal cards.', values: [
    ['1fr 1fr', 'Two equal columns. fr = one share of the free space.'], ['1fr 1fr 1fr', 'Three equal columns.'], ['2fr 1fr', 'The first column gets twice the space.'], ['120px 1fr', 'A fixed column, and one that takes the rest.']] },

  // ---------------------------------------------------------------- Motion
  { name: 'transform', group: 'Motion', demo: 'box', base: 'width: 160px;', what: 'Moves, turns or resizes a box without moving the others.', use: 'Hover effects.', values: [
    ['none', 'As it is.'], ['rotate(10deg)', 'Turned 10 degrees.'], ['scale(1.3)', '1.3 times as big.'], ['translateX(60px)', 'Slid 60px to the right.']] },
  { name: 'transition', group: 'Motion', demo: 'hover', hover: true, what: 'Makes changes happen slowly instead of at once.', use: 'Goes on the normal rule; the change comes from :hover. Hover over the box to see it.', values: [
    ['none', 'Hover: the box changes instantly.'], ['all 0.3s', 'Hover: the change takes 0.3 seconds.'], ['all 1.5s', 'Hover: the change takes 1.5 seconds.']] },
  { name: 'cursor', group: 'Motion', demo: 'hover', hover: true, what: 'The mouse pointer shape over this box.', use: 'pointer on anything clickable that is not a link or button. Hover over the box to see it.', values: [
    ['default', 'The normal arrow.'], ['pointer', 'The hand, like on a link.'], ['not-allowed', 'A no-entry sign, for disabled things.']] },
]
