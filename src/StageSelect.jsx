import { buttonsColors, stageLabels } from "./stage-colors";

export default function StageSelect({ stageFilter, handleStageFilterChange }) {
  return (
    <div className="stage-buttons">
      {stageLabels.map(stage => {
        const background = buttonsColors[stage]
        return (
          <button
            key={stage}
            className={stageFilter === stage ? 'active' : ''}
            style={{
              background,
              transition: 'background-color 0.3s ease',
            }}
            onClick={() => handleStageFilterChange(stage)}
          >
            {stage}
          </button>
        )
      })}

      <button
        className={!stageFilter ? 'active' : ''}
        style={{
          background: buttonsColors.All,
          transition: 'background-color 0.3s ease',
        }}
        onClick={() => handleStageFilterChange('')}
      >
        All
      </button>
    </div>
  );

}