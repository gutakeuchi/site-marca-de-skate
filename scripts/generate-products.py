# -*- coding: utf-8 -*-
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CATEGORIES = {
    "camisasm.html": ("masculino-camisas", "Camisas masculinas"),
    "calcasm.html": ("masculino-calcas", "Calças masculinas"),
    "moletonsm.html": ("masculino-moletons", "Moletons masculinos"),
    "bermudasm.html": ("masculino-bermudas", "Bermudas"),
    "camisasf.html": ("feminino-camisas", "Camisas femininas"),
    "calcasf.html": ("feminino-calcas", "Calças femininas"),
    "moletonsf.html": ("feminino-moletons", "Moletons femininos"),
    "croppedf.html": ("feminino-cropped", "Cropped"),
    "adidas.html": ("tenis-adidas", "Tênis Adidas"),
    "vans.html": ("tenis-vans", "Tênis Vans"),
    "nike.html": ("tenis-nike", "Tênis Nike SB"),
    "dc.html": ("tenis-dc", "Tênis DC"),
    "ous.html": ("tenis-ous", "Tênis OUS"),
    "skate.html": ("skate", "Skates"),
    "shape.html": ("shape", "Shapes"),
    "lixa.html": ("lixa", "Lixas"),
    "truck.html": ("truck", "Trucks"),
    "roda.html": ("rodas", "Rodas"),
    "rolamento.html": ("rolamento", "Rolamentos"),
}

ITEM_RE = re.compile(
    r'class="imgItem"\s+src="([^"]*)"\s*>\s*'
    r'<n class="legendaItem">([^<]*)</n>\s*<br>\s*'
    r'<n class="precoItem">([^<]*)</n>',
    re.IGNORECASE,
)


def parse_price(raw: str) -> float:
    text = raw.strip().replace("R$", "").replace(" ", "")
    if not text:
        return 0.0
    if "," in text:
        text = text.replace(".", "").replace(",", ".")
    return float(text)


def ts_string(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
    return f'"{escaped}"'


def main() -> None:
    products: list[str] = []
    index = 1
    for filename, (slug, _) in CATEGORIES.items():
        html = (ROOT / filename).read_text(encoding="utf-8")
        for image, name, price in ITEM_RE.findall(html):
            image = image.replace("img/", "IMG/")
            name = " ".join(name.split())
            if name.startswith("CCAMISETA"):
                name = "C" + name[2:]
            products.append(
                "  {\n"
                f"    id: {index},\n"
                f"    name: {ts_string(name)},\n"
                f"    price: {parse_price(price)},\n"
                f"    image: {ts_string(image)},\n"
                f"    category: {ts_string(slug)},\n"
                "  }"
            )
            index += 1

    featured = """export const featuredHome = {
  camisetas: [6, 7, 5],
  shapes: ['SHAPE ELEMENT TRAPPED WESTGATE', 'SHAPE ITACHI', 'SHAPE PRIMOR AZUL'],
  tenis: [
    'Tênis Adidas Tyshawn Low Black White',
    'Tênis Nike SB Blazer Low Pro GT ISO',
    'TÊNIS VANS OLD SKOOL PLATAFORM CHECKBOARD',
  ],
} as const;
"""

    banners = """export const banners = [
  { src: 'IMG/banners/promocaocamiseta.jpg', alt: 'Promoção de camisetas Wolf Board' },
  { src: 'IMG/banners/bannerskate.jpeg', alt: 'Banner de skate Wolf Board' },
  { src: 'IMG/banners/bannerpromocaonovidades1.png', alt: 'Novidades e promoções Wolf Board' },
] as const;
"""

    categories_ts = """export const categories = [
  { slug: 'masculino-camisas', title: 'Camisas masculinas', group: 'Masculino' },
  { slug: 'masculino-calcas', title: 'Calças masculinas', group: 'Masculino' },
  { slug: 'masculino-moletons', title: 'Moletons masculinos', group: 'Masculino' },
  { slug: 'masculino-bermudas', title: 'Bermudas', group: 'Masculino' },
  { slug: 'feminino-camisas', title: 'Camisas femininas', group: 'Feminino' },
  { slug: 'feminino-calcas', title: 'Calças femininas', group: 'Feminino' },
  { slug: 'feminino-moletons', title: 'Moletons femininos', group: 'Feminino' },
  { slug: 'feminino-cropped', title: 'Cropped', group: 'Feminino' },
  { slug: 'tenis-adidas', title: 'Adidas', group: 'Tênis' },
  { slug: 'tenis-vans', title: 'Vans', group: 'Tênis' },
  { slug: 'tenis-nike', title: 'Nike SB', group: 'Tênis' },
  { slug: 'tenis-dc', title: 'DC', group: 'Tênis' },
  { slug: 'tenis-ous', title: 'OUS', group: 'Tênis' },
  { slug: 'skate', title: 'Skate', group: 'Skate' },
  { slug: 'shape', title: 'Shape', group: 'Skate' },
  { slug: 'lixa', title: 'Lixa', group: 'Skate' },
  { slug: 'truck', title: 'Truck', group: 'Skate' },
  { slug: 'rodas', title: 'Rodas', group: 'Skate' },
  { slug: 'rolamento', title: 'Rolamento', group: 'Skate' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];
"""

    types = """export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: CategorySlug;
};
"""

    extra_home = """
export const homeHighlights: Product[] = [
  {
    id: 9001,
    name: 'Tênis Adidas Tyshawn Low Black White',
    price: 599,
    image: 'IMG/tenis/adidas/tenis-adidas.png',
    category: 'tenis-adidas',
  },
  {
    id: 9002,
    name: 'Tênis Nike SB Blazer Low Pro GT ISO',
    price: 599,
    image: 'IMG/tenis/nike/tenis-nike-sb-blazer-low-pro-GT-iso.png',
    category: 'tenis-nike',
  },
  {
    id: 9003,
    name: 'Tênis Vans Old Skool Platform Checkboard',
    price: 379,
    image: 'IMG/tenis/vans/tenis-vans-old-skool-plataform-checkboard.png',
    category: 'tenis-vans',
  },
];
"""

    out = (
        categories_ts
        + "\n"
        + types
        + "\n"
        + banners
        + "\n"
        + "export const products: Product[] = [\n"
        + ",\n".join(products)
        + "\n];\n"
        + extra_home
    )

    dest = ROOT / "src" / "data" / "catalog.ts"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(out, encoding="utf-8")
    print(f"Wrote {len(products)} products to {dest}")


if __name__ == "__main__":
    main()
