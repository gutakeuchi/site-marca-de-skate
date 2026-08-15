export function productPath(id: number): string {
  return `/produto/${id}`;
}

export function categoryPath(slug: string): string {
  return `/categoria/${slug}`;
}
