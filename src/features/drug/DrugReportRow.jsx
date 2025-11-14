import Table from '../../ui/Table';
import styled from 'styled-components';
import ModalCenter from '../../ui/ModalCenter';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import DrugReportDetail from './DrugReportDetail';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDrugReport } from './APIDrugs';
import toast from 'react-hot-toast';

const Text = styled.span`
  color: #0a1b39;
  font-size: 14px;
  font-weight: 500;
  margin: auto;
`;

const DrugReportRow = ({ report }) => {
  const {
    ID_BCSDT,
    Thang,
    Nam,
    TongSoLuongNhap,
    SoLuongDung,
    SoLanDung,
    thuoc,
  } = report;

  const queryClient = useQueryClient();

  const { mutate: deleteDrugReportMutation, isLoading } = useMutation({
    mutationFn: deleteDrugReport,
    onSuccess: () => {
      toast.success('Xoá báo cáo thành công');
      queryClient.invalidateQueries({ queryKey: ['drugReports'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Xoá báo cáo thất bại');
    },
  });

  function handleDelete() {
    deleteDrugReportMutation(ID_BCSDT);
  }

  return (
    <Table.Row>
      <Text>{ID_BCSDT}</Text>
      <Text>{thuoc?.TenThuoc || 'N/A'}</Text>
      <Text>Tháng {Thang}/{Nam}</Text>
      <Text>{TongSoLuongNhap || 0}</Text>
      <Text>{SoLuongDung || 0}</Text>
      <Text>{SoLanDung || 0}</Text>

      <div className='flex items-center justify-center gap-2'>
        <ModalCenter>
          <ModalCenter.Open opens={`drug-report-detail-${ID_BCSDT}`}>
            <button className='text-white py-1 px-2 bg-primary flex items-center justify-center rounded-lg font-semibold'>
              <EyeIcon className='w-5 h-5' />
            </button>
          </ModalCenter.Open>
          <ModalCenter.Window name={`drug-report-detail-${ID_BCSDT}`}>
            <DrugReportDetail ID_BCSDT={ID_BCSDT} />
          </ModalCenter.Window>
        </ModalCenter>

        <ModalCenter>
          <ModalCenter.Open opens={`delete-drug-report-${ID_BCSDT}`}>
            <button className='text-white py-1 px-2 bg-error-900 flex items-center justify-center rounded-lg font-semibold'>
              <TrashIcon className='w-5 h-5' />
            </button>
          </ModalCenter.Open>
          <ModalCenter.Window name={`delete-drug-report-${ID_BCSDT}`}>
            <ConfirmDelete
              resourceName={`Báo cáo ${thuoc?.TenThuoc || 'thuốc'} tháng ${Thang}/${Nam}`}
              onConfirm={handleDelete}
              disabled={isLoading}
            />
          </ModalCenter.Window>
        </ModalCenter>
      </div>
    </Table.Row>
  );
};

export default DrugReportRow;

