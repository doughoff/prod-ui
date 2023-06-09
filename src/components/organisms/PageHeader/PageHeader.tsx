import { Breadcrumb, Typography } from 'antd'

interface Props {
  pageTitle: string
  items: Array<{
    title: JSX.Element | string
  }>
}

const PageHeader: React.FunctionComponent<Props> = ({ items, pageTitle }) => {
  return (
    <div className='px-5 py-2 bg-gray-100'>
      <Breadcrumb
        style={{ margin: '16px 0' }}
        items={items.map((item) => ({
          title: item.title
        }))}
      />
      <div className='flex justify-between '>
        <Typography.Title level={3}>{pageTitle}</Typography.Title>
      </div>
    </div>
  )
}

export default PageHeader
