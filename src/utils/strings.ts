
/**
 * This function splits long texts into smaller chunks.
 * @param text The input long text
 * @param maxLength The max length of a chunk
 * @returns An array of smaller strings
 */
export function splitTextIntoChunks(text: string, maxLength: number = 2000): string[] {
    const chunks: string[] = [];
    let currentIndex = 0;

    while (currentIndex < text.length) {
        let nextIndex = currentIndex + maxLength;

        if (nextIndex >= text.length) {
            chunks.push(text.substring(currentIndex));
            break;
        }

        // Ensure the chunk ends at the end of a word
        if (text[nextIndex] !== ' ') {
            while (nextIndex > currentIndex && text[nextIndex] !== ' ') {
                nextIndex--;
            }
        }

        // If no space found, cut at maxLength (word will be cut)
        if (nextIndex === currentIndex) {
            nextIndex = currentIndex + maxLength;
        }

        chunks.push(text.substring(currentIndex, nextIndex).trim());
        currentIndex = nextIndex + 1; // move past the space
    }

    return chunks;
}
