import '../styles/EmptyState.css';

const EmptyState = ({ 
  icon = '📚', 
  title = 'No Items Found', 
  description = 'Try adjusting your search or filters',
  action = null 
}) => {
  return (
    <div className="empty-state" role="status" aria-label="No items found">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
