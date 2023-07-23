import React from "react";
import { DebounceSelect } from "../DebounceSelect";
import { getProducts } from "../../../api";

export interface ProductSelectorProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

const ProductSelector: React.FC<ProductSelectorProps> = React.forwardRef(
  function ProductSelector(
    { placeholder, value, onChange, style }: ProductSelectorProps,
    ref?: React.Ref<unknown>
  ) {
    const fetchProducts = React.useCallback(async (search: string) => {
      const products = await getProducts({
        search: search,
        limit: 10,
        offset: 0,
        status: ["ACTIVE"],
      });

      return products.items.map((product) => ({
        label: `${product.barcode} - ${product.name}`,
        value: product.id,
      }));
    }, []);

    return (
      <DebounceSelect
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={ref}
        className="w-full"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        dataFetcher={fetchProducts}
        style={{
          ...style,
        }}
      />
    );
  }
);
export default ProductSelector;
