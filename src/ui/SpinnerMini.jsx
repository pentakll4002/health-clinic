import styled, { keyframes } from "styled-components";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const SpinnerMini = styled(ArrowPathIcon)`
  width: 24px;
  height: 24px;
  animation: ${rotate} 1.5s infinite linear;
`;

export default SpinnerMini;
