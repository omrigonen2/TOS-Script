# TOSModal - Terms of Service Modal

A JavaScript class that converts a standard Terms of Service checkbox into an interactive modal flow where users must read the terms before accepting.

## Features

- Forces users to open a modal to read Terms of Service
- Requires users to scroll to the bottom of the terms before they can accept
- Visual indicator showing users they need to scroll to enable the checkbox
- Automatically enables checkbox for short content that doesn't require scrolling
- Syncs checkbox state between modal and original form
- Option to clear original TOS content after initializing
- Option to copy TOS content to a target container after approval
- Can restore TOS content to the same container or a different one after approval
- Fully customizable approval text
- Mobile-friendly design
- Comprehensive error handling

## Project Structure

- `tos-modal.js` - The main JavaScript class implementation
- `/tests` - Test files demonstrating various usage scenarios
  - `test-basic.html` - Basic implementation with a simple form
  - `test-with-target.html` - Implementation with a target container for TOS content
  - `test-error-handling.html` - Demonstrates error handling and validation
  - `test-short-content.html` - Shows behavior with different content lengths
  - `test-disappear-reappear.html` - Demonstrates hiding and restoring TOS content

## Usage

### Basic Implementation

1. Include the `tos-modal.js` file in your HTML:

```html
<script src="path/to/tos-modal.js"></script>
```

2. Initialize the TOSModal class with the required parameters:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const tosModal = new TOSModal({
        checkbox: document.getElementById('tosCheckbox'),
        tosContainer: document.getElementById('tosContent'),
        clearOriginalTOS: true,
        approveText: 'I have read and agree to the Terms of Service'
    });
});
```

### Configuration Options

The TOSModal constructor accepts an object with the following properties:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| checkbox | HTMLElement | Yes | - | The checkbox element that users will check to agree to Terms |
| tosContainer | HTMLElement | Yes | - | Container element that contains the original TOS text |
| tosTargetContainer | HTMLElement | No | null | Optional target container to append TOS content to after approval |
| clearOriginalTOS | boolean | No | false | Whether to clear the original TOS container after reading content |
| approveText | string | No | 'I have read and agree to the Terms of Service' | Text for the approval checkbox in the modal |

### Example

HTML:
```html
<div class="form-group">
    <input type="checkbox" id="tosCheckbox" name="tosCheckbox" required>
    <label for="tosCheckbox">I agree to the Terms of Service</label>
</div>

<div id="tosContent">
    <h2>Terms of Service</h2>
    <p>Your terms of service content here...</p>
</div>

<!-- Optional target container -->
<div id="tosTargetContainer" style="display: none;"></div>
```

JavaScript:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const tosModal = new TOSModal({
        checkbox: document.getElementById('tosCheckbox'),
        tosContainer: document.getElementById('tosContent'),
        tosTargetContainer: document.getElementById('tosTargetContainer'),
        clearOriginalTOS: true,
        approveText: 'I confirm that I have read and agree to the Terms of Service'
    });
});
```

### Hide and Restore TOS Content

You can use the `clearOriginalTOS` and `tosTargetContainer` parameters to create a pattern where:

1. Original TOS content is shown on the page
2. TOS content is removed when TOSModal initializes
3. Content is restored (to same or different container) after user approves

```javascript
// Hide and restore to same container
const tosModal = new TOSModal({
    checkbox: document.getElementById('tosCheckbox'),
    tosContainer: document.getElementById('tosContainer'),
    tosTargetContainer: document.getElementById('tosContainer'), // Same as tosContainer
    clearOriginalTOS: true
});

// Hide and restore to different container
const tosModal = new TOSModal({
    checkbox: document.getElementById('tosCheckbox'),
    tosContainer: document.getElementById('tosSourceContainer'),
    tosTargetContainer: document.getElementById('tosTargetContainer'), // Different container
    clearOriginalTOS: true
});
```

## Behavior

1. When initialized, the original checkbox is disabled
2. A "Read Terms of Service" link is added next to the checkbox
3. Clicking the link opens a modal with the TOS content
4. A yellow warning banner appears telling users to scroll to the bottom to enable the checkbox
5. If content is short and doesn't require scrolling, the checkbox is automatically enabled
6. For longer content, users must scroll to the bottom to enable the acceptance checkbox
7. After checking the box and clicking "Approve", the modal closes
8. The original checkbox becomes checked and enabled
9. If a target container is specified, the TOS content is copied there

## Error Handling

The class has built-in validation that will throw helpful error messages if:

- The checkbox element is invalid or missing
- The TOS container is invalid or missing
- The target container (if provided) is invalid
- The approveText is empty

## Browser Support

The TOSModal class works in all modern browsers:
- Chrome, Firefox, Safari, Edge (latest versions)
- Internet Explorer 11 (with appropriate polyfills)

## Running Tests

To test the implementation:

1. Clone this repository
2. Open any of the HTML files in the `/tests` directory in your browser
3. Each test file demonstrates different features and scenarios 