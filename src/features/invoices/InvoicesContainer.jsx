import Table from '../../ui/Table';
import { useInvoices } from './useInvoices';
import Spinner from '../../ui/Spinner';
import LoadMore from '../../ui/LoadMore';
import InvoiceRow from './InvoiceRow';

const InvoicesContainer = () => {
  const { isLoading, invoices, hasMore, loadMore } = useInvoices();

  if (isLoading) return <Spinner />;

  if (invoices.length === 0) {
    return (
      <div className='text-center py-10 text-grey-500'>
        Không có hoá đơn nào
      </div>
    );
  }

  return (
    <>
      <div className='bg-white rounded-lg border border-grey-transparent overflow-hidden'>
        <Table columns='1fr 1fr 2fr 1fr 1fr 1fr 1fr'>
          <Table.Header>
            <div className='mx-auto'>ID Hoá Đơn</div>
            <div className='mx-auto'>ID Phiếu Khám</div>
            <div className='mx-auto'>Nhân Viên</div>
            <div className='mx-auto'>Ngày</div>
            <div className='mx-auto'>Tiền Khám</div>
            <div className='mx-auto'>Tiền Thuốc</div>
            <div className='mx-auto'>Tổng Tiền</div>
          </Table.Header>

        <Table.Body
          data={invoices}
          render={(invoice) => (
            <InvoiceRow key={invoice.ID_HoaDon} invoice={invoice} />
          )}
        />
        </Table>
      </div>

      {!hasMore ? (
        <span />
      ) : (
        <LoadMore onClick={loadMore} disabled={!hasMore} />
      )}
    </>
  );
};

export default InvoicesContainer;


