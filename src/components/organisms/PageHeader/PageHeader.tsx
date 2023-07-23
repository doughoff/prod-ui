import { Breadcrumb, Typography } from "antd";
import React from "react";

interface Props {
  pageTitle?: string | undefined;
  content?: JSX.Element;
  items: Array<{
    title: JSX.Element | string;
  }>;
}

const PageHeader: React.FunctionComponent<Props> = ({
  items,
  pageTitle,
  content,
}) => {
  return (
    <div className="px-6 py-2">
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={items.map((item) => ({
          title: item.title,
        }))}
      />
      <div className="flex justify-between ">
        {pageTitle && (
          <Typography.Title level={3}>{pageTitle}</Typography.Title>
        )}
      </div>
      <div>{content}</div>
    </div>
  );
};

export default PageHeader;
