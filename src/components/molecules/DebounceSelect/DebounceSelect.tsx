import React from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";

export interface DebounceSelectProps {
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value: string) => void;
  dataFetcher: (search: string) => Promise<SelectProps["options"]>;
  debounceTimeout?: number;
  minSearchLength?: number;
  notFoundContent?: React.ReactNode;
}

const DebounceSelect: React.FC<DebounceSelectProps> = React.forwardRef(
  function DebounceSelect(
    {
      placeholder,
      className,
      style,
      dataFetcher,
      value,
      onChange,
      debounceTimeout = 300,
      minSearchLength = 3,
      notFoundContent = "Ningún resultado encontrado",
    }: DebounceSelectProps,
    inputRef?: React.Ref<unknown>
  ) {
    const [options, setOptions] = React.useState<SelectProps["options"]>([]);
    const [showNotFound, setShowNotFound] = React.useState<boolean>(false);

    const debounceTimer = React.useRef<unknown>(null);

    const fetchOptions = React.useCallback(
      (search: string) => {
        if (search.length < minSearchLength) {
          setShowNotFound(false);
          return;
        }

        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
          dataFetcher(search).then((options) => {
            if (options?.length === 0) {
              setShowNotFound(true);
            } else {
              setShowNotFound(false);
            }

            setOptions(options);
          });
        }, debounceTimeout);
      },
      [dataFetcher]
    );

    React.useEffect(() => {
      setOptions([]);
    }, [value]);

    return (
      <Select
        className={className}
        ref={inputRef}
        showSearch
        allowClear
        onClear={() => {
          setOptions([]);
        }}
        placeholder={placeholder}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={fetchOptions}
        value={value}
        onChange={onChange}
        notFoundContent={showNotFound ? notFoundContent : null}
        options={options}
        style={style}
      />
    );
  }
);

export default DebounceSelect;
