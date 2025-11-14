import styled from 'styled-components';
import DrugCard from './DrugCard';
import LoadMore from '../../ui/LoadMore';
import { useDrugs } from './useDrugs';
import Spinner from '../../ui/Spinner';

const ContainerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const DrugCardContainer = () => {
  const { isLoading, drugs, hasMore, loadMore } = useDrugs();

  if (isLoading) return <Spinner />;
  
  if (drugs.length === 0) {
    return (
      <div className='text-center py-10 text-grey-500'>
        Không có thuốc nào
      </div>
    );
  }

  return (
    <>
      <ContainerGrid>
        {drugs.map((drug) => (
          <DrugCard key={drug.ID_Thuoc} drug={drug} />
        ))}
      </ContainerGrid>

      {!hasMore ? (
        <span />
      ) : (
        <LoadMore onClick={loadMore} disabled={!hasMore} />
      )}
    </>
  );
};

export default DrugCardContainer;

