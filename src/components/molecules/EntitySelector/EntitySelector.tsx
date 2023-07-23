import React from "react";
import { DebounceSelect } from "../DebounceSelect";
import { getEntitites } from "../../../api";

export interface EntitySelectorProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

const EntitySelector: React.FC<EntitySelectorProps> = React.forwardRef(
  function EntitySelector(
    { placeholder, value, onChange, style }: EntitySelectorProps,
    ref?: React.Ref<unknown>
  ) {
    const fetchEntitys = React.useCallback(async (search: string) => {
      const suppliers = await getEntitites({
        search: search,
        limit: 10,
        offset: 0,
        status: ["ACTIVE"],
      });

      return suppliers.items.map((supplier) => ({
        label: `${supplier.name} - ${
          supplier.ruc ? "RUC: " + supplier.ruc : "CI: " + supplier.ci
        }`,
        value: supplier.id,
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
        dataFetcher={fetchEntitys}
        style={{
          ...style,
        }}
      />
    );
  }
);
export default EntitySelector;
