import styled from 'styled-components';

export const Container = styled.div`

  table {
  margin-top: 1rem;
  }

  th {
    color: orange;
  }
  .maintable {
    border-collapse: separate;
    border-spacing: 0.6rem;
  }
  .maintable th, .maintable td {
    text-align: left;
    padding: 0.2rem;
  }

  .title {
    margin-bottom: 2rem;
    padding: 0 1rem;

    @media screen and (max-width: 480px) {
      h1 {
        font-size: 20px;
      }
    }

    span {
      position: relative;
      color: ${({ theme }) => theme.colors.primary.light};    
    }
  }

  .header {
    display: grid;
    gap: 2rem;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;

    @media screen and (max-width: 480px) {
      flex-direction: column;
      justify-content: center;

      .select {
        margin-top: 1rem;
      }

      .pagination {
        margin-top: 1rem;
      }
    }

    .pagination {
      display: flex;
      align-items: center;
      margin-top: 2rem;

      button + button {
        margin-left: 1rem;
      }
    }

    .select {
      button + button {
        margin-left: 2rem;
      }
    }
  }

  .cards {
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;

    > div {
      margin: 1rem;
    }

    @media screen and (max-width: 480px) {
      flex-direction: column;
      align-items: center;
      justify-content: center;

      > div {
        margin: 1rem 0;
      }
    }
  }

  .loading {
    margin-left: 1rem;
    margin-top: 2rem;

    > span {
      font-size: 2rem;
    }
  }
`;
