import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Button from '../../ui/Button';
import ServiceForm from './ServiceForm';

function formatVnd(value) {
  const num = Number(value || 0);
  return num.toLocaleString('vi-VN');
}

function ServicesTable({ services, onCreate, onUpdate, onDelete, isSubmitting }) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-end'>
        <Modal>
          <Modal.Open opens='create-service'>
            <Button className='text-white bg-primary px-[10px] py-[6px] font-medium'>
              Thêm dịch vụ
            </Button>
          </Modal.Open>
          <Modal.Window name='create-service'>
            <ServiceForm
              initialValues={null}
              isSubmitting={isSubmitting}
              onSubmit={(payload) => onCreate(payload)}
            />
          </Modal.Window>
        </Modal>
      </div>

      <Table columns='1fr 1fr 160px'>
        <Table.Header>
          <div>Tên dịch vụ</div>
          <div>Đơn giá</div>
          <div />
        </Table.Header>

        <Table.Body
          data={services}
          render={(s) => (
            <Table.Row key={s.ID_DichVu}>
              <div className='font-medium text-grey-900'>{s.TenDichVu}</div>
              <div>{formatVnd(s.DonGia)} đ</div>
              <div className='flex items-center justify-end gap-2'>
                <Modal>
                  <Modal.Open opens={`edit-service-${s.ID_DichVu}`}>
                    <Button className='bg-light text-grey-900 px-[10px] py-[6px]'>Sửa</Button>
                  </Modal.Open>
                  <Modal.Window name={`edit-service-${s.ID_DichVu}`}>
                    <ServiceForm
                      initialValues={s}
                      isSubmitting={isSubmitting}
                      onSubmit={(payload) => onUpdate(s.ID_DichVu, payload)}
                    />
                  </Modal.Window>
                </Modal>

                <Modal>
                  <Modal.Open opens={`delete-service-${s.ID_DichVu}`}>
                    <Button className='bg-error-900 text-white px-[10px] py-[6px]'>Xoá</Button>
                  </Modal.Open>
                  <Modal.Window name={`delete-service-${s.ID_DichVu}`}>
                    <ConfirmDelete
                      resourceName='dịch vụ'
                      onConfirm={() => onDelete(s.ID_DichVu)}
                      disabled={isSubmitting}
                    />
                  </Modal.Window>
                </Modal>
              </div>
            </Table.Row>
          )}
        />
      </Table>
    </div>
  );
}

export default ServicesTable;
