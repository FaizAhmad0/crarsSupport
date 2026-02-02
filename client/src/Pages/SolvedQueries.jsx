import QueryTable from "./QueryTable";

const SolvedQueries = ({ status, reloadTrigger }) => {
  return <QueryTable status={status} reloadTrigger={reloadTrigger} />;
};

export default SolvedQueries;
