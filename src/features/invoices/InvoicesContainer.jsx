import Table from '../../ui/Table';
import LoadMore from '../../ui/LoadMore';
import InvoiceRow from './InvoiceRow';

const InvoicesContainer = ({ invoices, hasMore, loadMore }) => {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-10 text-grey-500">
        Không có hoá đơn nào
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-grey-transparent overflow-hidden">
        <Table columns="1fr 2fr 2fr 1fr 1fr 1fr 1fr 72px">
          <Table.Header>
            <div className="mx-auto">ID Hoá Đơn</div>
            <div className="mx-auto">ID Phiếu Khám</div>
            <div className="mx-auto">Nhân Viên</div>
            <div className="mx-auto">Ngày</div>
            <div className="mx-auto">Tiền Khám</div>
            <div className="mx-auto">Tiền Thuốc</div>
            <div className="mx-auto">Tổng Tiền</div>
            <div className="mx-auto">Xem</div>
          </Table.Header>

          <Table.Body
            data={invoices}
            render={(invoice) => (
              <InvoiceRow
                key={invoice.ID_HoaDon}
                invoice={invoice}
              />
            )}
          />
        </Table>
      </div>

      {hasMore && (
        <LoadMore onClick={loadMore} />
      )}
    </>
  );
};

export default InvoicesContainer;
