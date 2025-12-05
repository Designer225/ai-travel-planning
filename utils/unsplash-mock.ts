// Mock Unsplash function that returns placeholder images
// In a real implementation, this would use the actual unsplash_tool

const imageCache: Record<string, string> = {};

export async function unsplash_tool(query: string): Promise<string> {
  // Return cached image if available
  if (imageCache[query]) {
    return imageCache[query];
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Generate a deterministic placeholder based on query
  const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageId = 400 + (hash % 600);
  
  const url = `https://picsum.photos/seed/${encodeURIComponent(query)}/${imageId}/300`;
  imageCache[query] = url;
  
  return url;
}
