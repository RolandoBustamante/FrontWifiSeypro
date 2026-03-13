import { gql } from "@apollo/client";
import apollo from "../utils/apollo";

const client = apollo;

const Dashboard = {
  dashboardResumen: (periodo) => {
    const query = gql`
      query dashboardResumen($periodo: String) {
        dashboardResumen(periodo: $periodo) {
          success
          data
        }
      }
    `;

    return client.query({
      query,
      variables: { periodo },
      fetchPolicy: "no-cache",
    });
  },
};

export default Dashboard;
