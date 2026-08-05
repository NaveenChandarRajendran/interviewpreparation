# Frontend Interview Notes - HTML & CSS
## R1.1 HTML/CSS Fundamentals

---

# 1. Semantic HTML

## Definition
Semantic HTML means using HTML elements based on their meaning rather than their appearance.

Example:

```html
<header>
<nav></nav>
</header>

<main>
<section>
<article></article>
</section>
</main>

<footer></footer>
```

Instead of:

```html
<div>
    <div></div>
</div>
```

## Benefits

- Better SEO
- Better Accessibility
- Better Code Readability
- Easier Maintenance

## Common Semantic Tags

| Tag | Purpose |
|------|----------|
| header | Top section |
| nav | Navigation |
| main | Main Content |
| section | Group of Content |
| article | Independent Content |
| aside | Sidebar |
| footer | Bottom Section |
| form | User Input |
| button | Action Button |

## Interview Answer

> Semantic HTML means using meaningful HTML tags instead of generic divs. It improves SEO, accessibility, and maintainability.

---

# 2. CSS Box Model

Every HTML element is a box.

```

Margin
Border
Padding
Content

```

Example

```css
.box{
    width:200px;
    padding:20px;
    border:5px solid black;
    margin:10px;
}
```

Actual Width

```
Content = 200
Padding = 40
Border = 10
Margin = 20

Total = 270px
```

---

## box-sizing

### content-box (Default)

```
Width = Content only
Padding & Border added separately
```

### border-box (Recommended)

```
Width includes

Content
Padding
Border
```

```css
*{
    box-sizing:border-box;
}
```

### Why border-box?

- Easier calculations
- Better responsive layouts
- Used in almost every project

---

# 3. Flexbox

## Definition

Flexbox is a **one-dimensional layout system**.

Works either:

- Row
- Column

Example

```css
.container{
    display:flex;
}
```

## Important Properties

```css
display:flex;

justify-content

align-items

flex-direction

gap

flex-wrap

flex-grow

flex-shrink
```

## justify-content

Controls alignment on the **Main Axis**

Example

```css
justify-content:center;
```

## align-items

Controls alignment on the **Cross Axis**

Example

```css
align-items:center;
```

### Use Flexbox For

- Navbar
- Card Row
- Menu
- Buttons
- Forms

---

# 4. CSS Grid

## Definition

Grid is a **two-dimensional layout system**.

Handles

- Rows
- Columns

Example

```css
display:grid;

grid-template-columns:1fr 1fr 1fr;

gap:20px;
```

### Use Grid For

- Dashboard
- Gallery
- Admin Panel
- Complete Page Layout

---

# Flexbox vs Grid

| Flexbox | Grid |
|----------|------|
| 1D Layout | 2D Layout |
| Row OR Column | Rows AND Columns |
| Components | Entire Layout |
| Navbar | Dashboard |
| Buttons | Gallery |

### Interview Answer

Use Flexbox for component-level layouts.

Use Grid when controlling rows and columns together.

---

# 5. CSS Specificity

Determines which CSS rule wins.

Priority

```
Inline Style = 1000

ID = 100

Class = 10

Element = 1
```

Example

```css
div{
color:red;
}

.card{
color:blue;
}

#main{
color:green;
}
```

```html
<div id="main" class="card">
```

Winner

```
ID Selector
```

### If specificity is same?

Last declared rule wins.

### !important

Highest priority.

Avoid unless absolutely necessary.

---

# 6. Block Formatting Context (BFC)

## Definition

A BFC is an independent layout area.

It isolates its children from surrounding layout.

## Why Needed?

- Contains floated elements
- Prevents margin collapsing (certain cases)
- Creates isolated layout

Create BFC

```css
overflow:hidden;
```

or

```css
display:flow-root;
```

### Interview Answer

> BFC is an independent layout context that helps contain floats, isolate layouts, and avoid certain margin-collapsing issues.

---

# 7. Reflow vs Repaint

## Reflow

Layout changes.

Examples

```
Width

Height

Margin

Padding

Display
```

Browser recalculates positions.

Very expensive.

---

## Repaint

Only visual changes.

Examples

```
Color

Background

Visibility
```

Layout remains same.

Cheaper than Reflow.

---

## Difference

| Reflow | Repaint |
|---------|----------|
| Layout changes | Visual changes |
| Expensive | Less expensive |
| Position recalculated | No layout calculation |

---

# 8. Responsive Design

Definition

Design adapts to different screen sizes.

Techniques

- Flexbox
- Grid
- Media Queries
- Relative Units
- Mobile First Design

Example

```css
@media(max-width:768px){

.container{

flex-direction:column;

}

}
```

Useful Units

```
%

rem

em

vw

vh
```

---

# 9. Frequently Asked Interview Questions

## Q1 Why Semantic HTML?

- SEO
- Accessibility
- Readability

---

## Q2 Why use border-box?

Includes padding and border inside width.

Makes responsive design easier.

---

## Q3 Flexbox vs Grid?

Flexbox

→ One Direction

Grid

→ Two Direction

---

## Q4 Which selector has highest specificity?

```
Inline

↓

ID

↓

Class

↓

Element
```

---

## Q5 Difference between Reflow and Repaint?

Reflow

→ Layout recalculated

Repaint

→ Only color/style changes

---

## Q6 What is BFC?

Independent layout context.

Used for

- Float containment
- Layout isolation
- Prevent margin collapsing

---

# Interview One-Liners

### Semantic HTML

Use meaningful tags for better SEO and accessibility.

---

### Box Model

Every element consists of Content, Padding, Border, and Margin.

---

### Flexbox

One-dimensional layout system.

---

### Grid

Two-dimensional layout system.

---

### CSS Specificity

Inline > ID > Class > Element

---

### BFC

Independent layout context that contains floats and isolates layouts.

---

### Reflow

Layout recalculation.

---

### Repaint

Visual redraw without layout recalculation.

---

### Responsive Design

Use Flexbox, Grid, Media Queries, and Relative Units.

---

# Last Minute Revision (30 Seconds)

✅ Semantic HTML → SEO + Accessibility

✅ Box Model → Content → Padding → Border → Margin

✅ box-sizing:border-box

✅ Flex = One Dimension

✅ Grid = Two Dimension

✅ Specificity → Inline > ID > Class > Element

✅ BFC → Float Containment + Layout Isolation

✅ Reflow → Layout Change

✅ Repaint → Visual Change

✅ Responsive → Media Query + Flex/Grid