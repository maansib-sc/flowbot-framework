import CostCards from '../CostCards/CostCards';
import styles from './ProjectCard.module.css'; // Import CSS module

function ProjectCard({ options }: { options: any }) {
  return (
    <>
      <div className={styles.projectCardContainer}>
        <div className="flex flex-col">
          <p>{options.title}</p>
          <span>{options.value}</span>
        </div>
        <CostCards
          options={options.data}
          onChange={(value) => {}}
          showSubmit={false}
          fontSize="18px"
          containerStyle={{
            boxSizing: 'border-box',
            background: '#fff',
            borderRadius: '8px',
            border: '0.1px solid #fff',
            overflow: 'hidden',
          }}
          cardStyle={{
            background: 'inherit',
          }}
        />
      </div>
    </>
  );
}

export default ProjectCard;
