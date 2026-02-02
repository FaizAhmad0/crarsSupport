import QueryTable from "./QueryTable";

const FeedbackQueries = ({ status, reloadTrigger }) => {
  return <QueryTable status={status} reloadTrigger={reloadTrigger} />;
};

export default FeedbackQueries;
