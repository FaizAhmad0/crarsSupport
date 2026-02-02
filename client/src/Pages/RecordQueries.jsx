import QueryTable from "./QueryTable";

const RecordQueries = ({ status, reloadTrigger }) => {
  return <QueryTable status={status} reloadTrigger={reloadTrigger} />;
};

export default RecordQueries;
