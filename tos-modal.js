/**
 * TOSModal - A class to handle Terms of Service modal functionality
 * 
 * This class takes a checkbox, container element, and other options to create
 * a modal for users to view Terms of Service, scroll to bottom, and approve.
 */
class TOSModal {
  /**
   * Create a new TOSModal
   * @param {Object} config - Configuration object
   * @param {HTMLElement} config.checkbox - The checkbox element to be checked after approval
   * @param {HTMLElement} config.tosContainer - Container element that contains the TOS text
   * @param {HTMLElement|null} config.tosTargetContainer - Optional target container to append TOS content to after approval
   * @param {boolean} config.clearOriginalTOS - Whether to clear the original TOS container after reading content
   * @param {string} config.approveText - Text for the approval checkbox in the modal
   */
  constructor(config) {
    // Store configuration
    this.checkbox = config.checkbox;
    this.tosContainer = config.tosContainer;
    this.tosTargetContainer = config.tosTargetContainer || null;
    this.clearOriginalTOS = config.clearOriginalTOS || false;
    this.approveText = config.approveText || 'I have read and agree to the Terms of Service';
    
    // Content storage
    this.tosContent = '';
    
    // Modal elements
    this.modal = null;
    this.modalCheckbox = null;
    this.approveButton = null;
    this.hasScrolledToBottom = false;
    this.scrollIndicator = null;
    this.endMarker = null;
    
    // Validate inputs
    this.validateInputs();
    
    // Initialize
    this.init();
  }
  
  /**
   * Validate the inputs provided to the constructor
   * @private
   */
  validateInputs() {
    if (!this.checkbox || !(this.checkbox instanceof HTMLElement)) {
      throw new Error('Checkbox must be a valid HTML element');
    }
    
    if (!this.tosContainer || !(this.tosContainer instanceof HTMLElement)) {
      throw new Error('TOS Container must be a valid HTML element');
    }
    
    if (this.tosTargetContainer && !(this.tosTargetContainer instanceof HTMLElement)) {
      throw new Error('TOS Target Container must be a valid HTML element if provided');
    }
    
    if (typeof this.clearOriginalTOS !== 'boolean') {
      throw new Error('clearOriginalTOS must be a boolean');
    }
    
    if (typeof this.approveText !== 'string' || this.approveText.trim() === '') {
      throw new Error('Approve text must be a non-empty string');
    }
  }
  
  /**
   * Initialize the TOS Modal functionality
   * @private
   */
  init() {
    // Disable the original checkbox
    this.checkbox.disabled = true;
    
    // Extract TOS content
    this.tosContent = this.tosContainer.innerHTML;
    
    // Clear original TOS if needed
    if (this.clearOriginalTOS) {
      this.tosContainer.innerHTML = '';
    }
    
    // Create the link to open the TOS modal
    this.createTOSLink();
    
    // Create the modal (but don't append it to the DOM yet)
    this.createModal();
  }
  
  /**
   * Create a link to open the TOS modal
   * @private
   */
  createTOSLink() {
    const tosLink = document.createElement('a');
    tosLink.href = '#';
    tosLink.textContent = 'Read Terms of Service';
    tosLink.className = 'tos-link';
    tosLink.style.marginLeft = '10px';
    tosLink.style.textDecoration = 'underline';
    tosLink.style.cursor = 'pointer';
    tosLink.style.color = '#0066cc';
    
    tosLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.openModal();
    });
    
    // Insert the link after the checkbox
    this.checkbox.parentNode.insertBefore(tosLink, this.checkbox.nextSibling);
  }
  
  /**
   * Create the TOS modal
   * @private
   */
  createModal() {
    // Create modal container
    this.modal = document.createElement('div');
    this.modal.className = 'tos-modal';
    this.modal.style.display = 'none';
    this.modal.style.position = 'fixed';
    this.modal.style.zIndex = '1000';
    this.modal.style.left = '0';
    this.modal.style.top = '0';
    this.modal.style.width = '100%';
    this.modal.style.height = '100%';
    this.modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    this.modal.style.overflowX = 'hidden';
    this.modal.style.overflowY = 'auto';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'tos-modal-content';
    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.margin = '50px auto';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '800px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'tos-modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.color = '#aaa';
    closeBtn.style.float = 'right';
    closeBtn.style.fontSize = '28px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.cursor = 'pointer';
    
    closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = 'Terms of Service';
    title.style.marginTop = '0';
    
    // Create scroll indicator
    this.scrollIndicator = document.createElement('div');
    this.scrollIndicator.className = 'tos-scroll-indicator';
    this.scrollIndicator.style.backgroundColor = '#ffffc0';
    this.scrollIndicator.style.padding = '10px';
    this.scrollIndicator.style.marginBottom = '15px';
    this.scrollIndicator.style.borderRadius = '4px';
    this.scrollIndicator.style.textAlign = 'center';
    this.scrollIndicator.style.fontWeight = 'bold';
    this.scrollIndicator.style.border = '1px solid #e6e600';
    this.scrollIndicator.innerHTML = '⚠️ Please scroll to the bottom of the Terms to enable the approval checkbox';
    
    // Create content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.style.position = 'relative';
    contentWrapper.style.marginBottom = '20px';
    
    // Create TOS content container
    const tosContentDiv = document.createElement('div');
    tosContentDiv.className = 'tos-content';
    tosContentDiv.innerHTML = this.tosContent;
    tosContentDiv.style.height = '300px';
    tosContentDiv.style.overflowY = 'auto';
    tosContentDiv.style.border = '1px solid #ddd';
    tosContentDiv.style.padding = '15px';
    tosContentDiv.style.marginBottom = '5px';
    tosContentDiv.style.backgroundColor = '#f9f9f9';
    
    // Add some more space at the bottom to ensure scrolling works properly
    const spacer = document.createElement('div');
    spacer.style.height = '30px';
    tosContentDiv.appendChild(spacer);
    
    // Create scroll end indicator
    const scrollEndIndicator = document.createElement('div');
    scrollEndIndicator.className = 'scroll-end-indicator';
    scrollEndIndicator.style.textAlign = 'center';
    scrollEndIndicator.style.padding = '10px 5px';
    scrollEndIndicator.style.backgroundColor = '#f0fff0';
    scrollEndIndicator.style.border = '1px dashed #4CAF50';
    scrollEndIndicator.style.borderRadius = '4px';
    scrollEndIndicator.style.marginTop = '15px';
    scrollEndIndicator.style.marginBottom = '5px';
    scrollEndIndicator.innerHTML = '✓ You have reached the end of the Terms of Service';
    scrollEndIndicator.style.display = 'none';
    
    // Create approval section (initially disabled)
    const approvalSection = document.createElement('div');
    approvalSection.className = 'tos-approval-section';
    approvalSection.style.marginTop = '15px';
    approvalSection.style.opacity = '0.6';
    approvalSection.style.transition = 'opacity 0.3s ease, background-color 0.3s ease, padding 0.3s ease';
    
    // Create approval checkbox
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.display = 'flex';
    checkboxContainer.style.alignItems = 'center';
    checkboxContainer.style.marginBottom = '15px';
    
    this.modalCheckbox = document.createElement('input');
    this.modalCheckbox.type = 'checkbox';
    this.modalCheckbox.id = 'tos-approval-checkbox';
    this.modalCheckbox.style.marginRight = '10px';
    
    const checkboxLabel = document.createElement('label');
    checkboxLabel.htmlFor = 'tos-approval-checkbox';
    checkboxLabel.textContent = this.approveText;
    
    checkboxContainer.appendChild(this.modalCheckbox);
    checkboxContainer.appendChild(checkboxLabel);
    
    // Create approve button
    this.approveButton = document.createElement('button');
    this.approveButton.textContent = 'Approve';
    this.approveButton.className = 'tos-approve-button';
    this.approveButton.style.padding = '10px 20px';
    this.approveButton.style.backgroundColor = '#4CAF50';
    this.approveButton.style.color = 'white';
    this.approveButton.style.border = 'none';
    this.approveButton.style.borderRadius = '4px';
    this.approveButton.style.cursor = 'pointer';
    this.approveButton.style.fontSize = '16px';
    
    // Append approval elements
    approvalSection.appendChild(checkboxContainer);
    approvalSection.appendChild(this.approveButton);
    
    // Initially disable checkbox until scrolled to bottom
    this.modalCheckbox.disabled = true;
    
    // Add checkbox change event
    this.modalCheckbox.addEventListener('change', () => {
      // Update the original checkbox to match the modal checkbox
      this.checkbox.checked = this.modalCheckbox.checked;
    });
    
    // Add approve button click event
    this.approveButton.addEventListener('click', () => {
      if (this.modalCheckbox.checked) {
        // Enable and check the original checkbox
        this.checkbox.disabled = false;
        this.checkbox.checked = true;
        
        // Copy TOS content to target container if specified
        if (this.tosTargetContainer) {
          this.tosTargetContainer.innerHTML = this.tosContent;
        }
        
        // Close the modal
        this.closeModal();
        
        // Scroll to make the checkbox visible at the top
        this.checkbox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Alert the user they need to check the box
        alert('Please check the box to confirm you have read and agree to the Terms of Service.');
      }
    });
    
    // Assemble content with end marker
    contentWrapper.appendChild(tosContentDiv);
    contentWrapper.appendChild(scrollEndIndicator);
    
    // Assemble modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(this.scrollIndicator);
    modalContent.appendChild(contentWrapper);
    modalContent.appendChild(approvalSection);
    this.modal.appendChild(modalContent);
    
    // Add modal to document body
    document.body.appendChild(this.modal);
  }
  
  /**
   * Open the TOS modal
   * @public
   */
  openModal() {
    this.modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    
    // Check if scrolling is needed after the modal is shown
    // This ensures proper measurements now that the modal is visible
    const tosContentDiv = this.modal.querySelector('.tos-content');
    const scrollEndIndicator = this.modal.querySelector('.scroll-end-indicator');
    const approvalSection = this.modal.querySelector('.tos-approval-section');
    
    // Reset state on every open
    this.hasScrolledToBottom = false;
    this.modalCheckbox.disabled = true;
    this.modalCheckbox.checked = false;
    this.scrollIndicator.style.display = 'block';
    scrollEndIndicator.style.display = 'none';
    approvalSection.style.opacity = '0.6';
    approvalSection.style.backgroundColor = 'transparent';
    approvalSection.style.padding = '0';
    
    // More accurate scrolling detection with a delay to ensure modal is fully rendered
    setTimeout(() => {
      const contentHeight = tosContentDiv.scrollHeight;
      const viewportHeight = tosContentDiv.clientHeight;
      const hasScrollbar = contentHeight > viewportHeight + 5; // Adding a small buffer
      
      if (!hasScrollbar) {
        // No scrolling needed, enable checkbox immediately
        this.hasScrolledToBottom = true;
        this.modalCheckbox.disabled = false;
        this.scrollIndicator.style.display = 'none';
        scrollEndIndicator.style.display = 'block';
        
        // Highlight the approval section to draw attention
        approvalSection.style.opacity = '1';
        approvalSection.style.backgroundColor = '#f0f8ff';
        approvalSection.style.padding = '15px';
        approvalSection.style.borderRadius = '5px';
      } else {
        // Set up scroll listener instead of using intersection observer
        const handleScroll = () => {
          // Check if scrolled to near bottom (within 5px)
          const isAtBottom = tosContentDiv.scrollHeight - tosContentDiv.scrollTop - tosContentDiv.clientHeight < 5;
          
          if (isAtBottom && !this.hasScrolledToBottom) {
            this.hasScrolledToBottom = true;
            this.modalCheckbox.disabled = false;
            this.scrollIndicator.style.display = 'none';
            scrollEndIndicator.style.display = 'block';
            
            // Highlight the approval section
            approvalSection.style.opacity = '1';
            approvalSection.style.backgroundColor = '#f0f8ff';
            approvalSection.style.padding = '15px';
            approvalSection.style.borderRadius = '5px';
            
            // Remove scroll listener once we've reached the bottom
            tosContentDiv.removeEventListener('scroll', handleScroll);
          }
        };
        
        // Add scroll event listener
        tosContentDiv.addEventListener('scroll', handleScroll);
        
        // Reset scroll position to top
        tosContentDiv.scrollTop = 0;
      }
    }, 100);
  }
  
  /**
   * Close the TOS modal
   * @public
   */
  closeModal() {
    this.modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  }
} 