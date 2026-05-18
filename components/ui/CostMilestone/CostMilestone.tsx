import CostCards from '../CostCards/CostCards';
import DynamicTable from '../DynamicTable/DynamicTable';

function CostMilestone({
  onClose,
  options,
  disabled = false,
}: {
  onClose: (value: string) => void;
  options: any;
  disabled?: boolean;
}) {
  return (
    <div>
      <CostCards
        options={options.data}
        onChange={(value) => {
        }}
        showSubmit={false}
        fontSize="32px"
        hightlightIndex={1}
      />
      {options?.table?.map((data: any, index: any) => {
        return (
          <>
            <h6 className="pt-8" style={{ color: 'var(--grey-100, #727A8B)' }}>
              {data?.name}
            </h6>
            <div className="mt-4">
              <DynamicTable
                data={data?.data}
                options={data.options}
                disabled={disabled}
                showconfirmButton={true}
                onChange={(value) => onClose(value)}
              />
            </div>
          </>
        );
      })}
    </div>
  );
}

export default CostMilestone;
