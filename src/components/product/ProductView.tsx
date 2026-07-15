'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product, ProductVariant, Attribute, AttributeValue } from '@/types/catalog';
import { mediaUrl } from '@/lib/strapi';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';

type Selection = Record<string, string>;

function buildGroups(variants: ProductVariant[]) {
  const groups: { attribute: Attribute; values: AttributeValue[] }[] = [];
  for (const variant of variants) {
    for (const av of variant.attributeValues ?? []) {
      if (!av.attribute) continue;
      let group = groups.find(
        (g) => g.attribute.documentId === av.attribute!.documentId
      );
      if (!group) {
        group = { attribute: av.attribute, values: [] };
        groups.push(group);
      }
      if (!group.values.some((v) => v.documentId === av.documentId)) {
        group.values.push(av);
      }
    }
  }
  return groups;
}

function initialSelection(variants: ProductVariant[]): Selection {
  const defaultVariant =
    variants.find((v) => v.isDefault) ?? variants[0];
  const selection: Selection = {};
  for (const av of defaultVariant?.attributeValues ?? []) {
    if (av.attribute) selection[av.attribute.documentId] = av.documentId;
  }
  return selection;
}

export default function ProductView({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const groups = buildGroups(variants);

  const [selection, setSelection] = useState<Selection>(() =>
    initialSelection(variants)
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const {addItem} = useCart();

  const selectedVariant = variants.find((variant) =>
    Object.entries(selection).every(([, valueId]) =>
      variant.attributeValues?.some((av) => av.documentId === valueId)
    )
  );

  const images =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product.images ?? [];
  const mainImage = images[activeImage] ?? images[0];

  const price = selectedVariant
    ? selectedVariant.discountPrice ?? selectedVariant.price
    : product.displayPrice;
  const hasDiscount =
    selectedVariant != null && selectedVariant.discountPrice != null;

  function selectValue(attributeId: string, valueId: string) {
    setSelection((prev) => ({ ...prev, [attributeId]: valueId }));
    setQuantity(1);
    setActiveImage(0);
  }

  return (
    <div className="mb-12 grid gap-10 md:grid-cols-2">
      <div>
        {mainImage ? (
          <Image
            src={mediaUrl(mainImage.url)}
            alt={mainImage.alternativeText ?? product.name}
            width={mainImage.width}
            height={mainImage.height}
            className="w-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-80 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
            No image
          </div>
        )}

        {images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {images.map((img, i) => (
              <button
                key={img.documentId}
                onClick={() => setActiveImage(i)}
                className={`overflow-hidden rounded border-2 ${
                  i === activeImage ? 'border-black' : 'border-transparent'
                }`}
              >
                <Image
                  src={mediaUrl(img.formats?.thumbnail?.url ?? img.url)}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="mb-2 text-3xl font-semibold">{product.name}</h1>

        {price != null && (
          <div className="mb-1 flex items-baseline gap-3">
            <p className="text-2xl font-bold">{formatPrice(price)}</p>
            {hasDiscount && (
              <p className="text-lg text-gray-400 line-through">
                {formatPrice(selectedVariant!.price)}
              </p>
            )}
          </div>
        )}

        {selectedVariant && (
          <p className="mb-6 text-sm text-gray-500">
            SKU: {selectedVariant.sku} ·{' '}
            {selectedVariant.stock > 0 ? (
              <span className="text-green-600">
                In stock ({selectedVariant.stock})
              </span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
          </p>
        )}

        {groups.map((group) => (
          <div key={group.attribute.documentId} className="mb-4">
            <p className="mb-2 text-sm font-medium">{group.attribute.name}</p>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => (
                <button
                  key={value.documentId}
                  onClick={() =>
                    selectValue(group.attribute.documentId, value.documentId)
                  }
                  className={`rounded border px-4 py-1.5 text-sm ${
                    selection[group.attribute.documentId] === value.documentId
                      ? 'border-black font-medium'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  {value.value}
                </button>
              ))}
            </div>
          </div>
        ))}

        {!selectedVariant && variants.length > 0 && (
          <p className="mb-4 text-sm text-red-500">
            This combination is unavailable.
          </p>
        )}

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded border border-gray-300">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-8 px-2 text-center text-sm">{quantity}</span>
            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.min(selectedVariant?.stock ?? 1, q + 1)
                )
              }
              className="px-3 py-2"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={() => selectedVariant && addItem(selectedVariant.documentId, quantity)}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="flex-1 rounded bg-black px-6 py-3 text-sm font-medium text-white disabled:bg-gray-300"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}