export interface ImageSearchResult {
  url: string;
  title: string;
  source: string;
}

export class BraveImageSearchService {
  private readonly apiKey: string;
  private readonly baseUrl =
    "https://api.search.brave.com/res/v1/images/search";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchImages(
    query: string,
    count: number = 5
  ): Promise<ImageSearchResult[]> {
    try {
      const searchParams = new URLSearchParams({
        q: query,
        count: count.toString(),
        search_lang: "en",
        country: "US",
        safesearch: "strict",
      });

      const response = await fetch(`${this.baseUrl}?${searchParams}`, {
        headers: {
          "X-Subscription-Token": this.apiKey,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Brave API error: ${response.status} ${response.statusText}`,
          errorText
        );
        return [];
      }

      const data = await response.json();

      if (!data.results || !Array.isArray(data.results)) {
        console.warn("No results array found in Brave API response");
        return [];
      }

      const mappedResults = data.results
        .map((result: any) => {
          return {
            url: result.properties?.url || result.thumbnail?.src || "",
            title: result.title || "",
            source: result.url || "",
          };
        })
        .filter((result: ImageSearchResult) => result.url);

      return mappedResults;
    } catch (error) {
      console.error("Error searching images with Brave API:", error);
      return [];
    }
  }

  async searchRecipeImage(recipeName: string): Promise<string | null> {
    const query = `${recipeName} recipe food dish`;
    const results = await this.searchImages(query, 1);
    const imageUrl = results.length > 0 ? results[0].url : null;
    console.log(`Recipe image result: ${imageUrl}`);
    return imageUrl;
  }

  async searchIngredientImage(ingredientName: string): Promise<string | null> {
    const query = `${ingredientName} plain ingredient`;
    const results = await this.searchImages(query, 1);
    const imageUrl = results.length > 0 ? results[0].url : null;
    return imageUrl;
  }
}
