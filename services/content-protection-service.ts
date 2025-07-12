export const ContentProtection = {
  // Prevent text selection
  preventTextSelection: () => {
    document.body.style.userSelect = "none"
    document.body.style.webkitUserSelect = "none"
    document.body.style.userSelect = "none"
    document.body.style.userSelect = "none"
  },
  // Allow text selection
  allowTextSelection: () => {
    document.body.style.userSelect = ""
    document.body.style.webkitUserSelect = ""
    document.body.style.userSelect = ""
    document.body.style.userSelect = ""
  },

  // Add watermark to the page
  addWatermark: (text: string) => {
    const watermarkContainer = document.createElement("div")
    watermarkContainer.className = "watermark-container"
    watermarkContainer.style.position = "fixed"
    watermarkContainer.style.top = "0"
    watermarkContainer.style.left = "0"
    watermarkContainer.style.width = "100%"
    watermarkContainer.style.height = "100%"
    watermarkContainer.style.pointerEvents = "none"
    watermarkContainer.style.zIndex = "1000"
    watermarkContainer.style.overflow = "hidden"

    // Create a grid of watermarks
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const watermark = document.createElement("div")
        watermark.innerText = text
        watermark.style.position = "absolute"
        watermark.style.left = `${i * 20}%`
        watermark.style.top = `${j * 20}%`
        watermark.style.transform = "rotate(-45deg)"
        watermark.style.fontSize = "16px"
        watermark.style.color = "rgba(200, 200, 200, 0.2)"
        watermarkContainer.appendChild(watermark)
      }
    }

    document.body.appendChild(watermarkContainer)
    return watermarkContainer
  },

  // Remove watermark
  removeWatermark: (watermarkContainer: HTMLElement) => {
    if (watermarkContainer && watermarkContainer.parentNode) {
      watermarkContainer.parentNode.removeChild(watermarkContainer)
    }
  },

  // Prevent keyboard shortcuts for copy/paste/print/screenshot
  preventKeyboardShortcuts: () => {
    const handler = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+P, Ctrl+Shift+I, PrtScn, etc.
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "p" || e.key === "s")) ||
        (e.ctrlKey && e.shiftKey && e.key === "i") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault()
        return false
      }
      return true
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  },

  // Prevent right-click context menu
  preventContextMenu: () => {
    const handler = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", handler)
    return () => document.removeEventListener("contextmenu", handler)
  },

  // Apply all protections
  applyAllProtections: (watermarkText = "PREVIEW ONLY") => {
    ContentProtection.preventTextSelection()
    const watermark = ContentProtection.addWatermark(watermarkText)
    const removeKeyboardHandler = ContentProtection.preventKeyboardShortcuts()
    const removeContextMenuHandler = ContentProtection.preventContextMenu()

    // Return function to remove all protections
    return () => {
      ContentProtection.allowTextSelection()
      ContentProtection.removeWatermark(watermark)
      removeKeyboardHandler()
      removeContextMenuHandler()
    }
  },
}
