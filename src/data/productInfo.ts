import { formatPrice } from "../utils/assets";
import type { CategorySlug, Product } from "./catalog";
import { getCategory } from "./catalog";

const clothingSizes = ["P", "M", "G", "GG"];
const shoeSizes = ["37", "38", "39", "40", "41", "42", "43", "44"];
const deckSizes = ["7.75", "8.0", "8.125", "8.25", "8.5"];
const truckSizes = ["139mm", "144mm", "149mm"];
const wheelSizes = ["52mm", "53mm", "54mm", "55mm", "60mm"];

export function getSizes(category: CategorySlug): string[] {
  if (category.startsWith("tenis-")) return shoeSizes;
  if (category === "shape" || category === "skate") return deckSizes;
  if (category === "truck") return truckSizes;
  if (category === "rodas") return wheelSizes;
  if (category === "lixa" || category === "rolamento") return ["Único"];
  return clothingSizes;
}

export function getSizeLabel(category: CategorySlug): string {
  if (category.startsWith("tenis-")) return "Numeração";
  if (category === "shape" || category === "skate") return "Largura";
  if (category === "truck") return "Medida";
  if (category === "rodas") return "Diâmetro";
  if (category === "lixa" || category === "rolamento") return "Tamanho";
  return "Tamanho";
}

export function getSku(product: Product): string {
  return `WB-${String(product.id).padStart(4, "0")}`;
}

export function getInstallments(price: number, times = 3): string {
  const value = price / times;
  return `${times}x de ${formatPrice(value)} sem juros`;
}

export function getDescription(product: Product): string {
  const category = getCategory(product.category);
  const group = category?.group ?? "Wolf Board";

  if (product.category.startsWith("tenis-")) {
    return `Tênis de skate ${product.name}. Cabedal reforçado, sola vulcanizada e amortecimento para impacto no street e no park. Item da linha ${group}.`;
  }
  if (product.category === "shape") {
    return `${product.name} em maple. Concavidade pensada para flip e controle, pronto para montar o setup.`;
  }
  if (product.category === "skate") {
    return `${product.name}. Completo pronto para andar, com shape, trucks, rodas e rolamentos alinhados.`;
  }
  if (product.category === "truck") {
    return `${product.name}. Truck para street e transition, com eixo estável e visual limpo.`;
  }
  if (product.category === "rodas") {
    return `${product.name}. Roda com dureza para street, slide controlado e boa velocidade no asfalto.`;
  }
  if (product.category === "rolamento") {
    return `${product.name}. Rolamento para giro mais limpo e menos atrito na sessão.`;
  }
  if (product.category === "lixa") {
    return `${product.name}. Grip consistente pra flip, manual e impacto.`;
  }
  return `${product.name}. Peça de streetwear Wolf Board, corte regular e estampa feita pra andar. Categoria: ${category?.title ?? group}.`;
}

export function getSpecs(product: Product): { label: string; value: string }[] {
  const category = getCategory(product.category);
  return [
    { label: "SKU", value: getSku(product) },
    { label: "Categoria", value: category?.title ?? product.category },
    { label: "Linha", value: category?.group ?? "Wolf Board" },
    { label: "Marca", value: "Wolf Board" },
    { label: "Disponibilidade", value: product.id % 5 === 0 ? "Últimas unidades" : "Em estoque" },
  ];
}
