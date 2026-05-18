import React, {ReactNode} from "react";
import styled from "@emotion/styled";
interface StyledDivProps {
    children: ReactNode;
}
const StyledDiv = styled.div`
  height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: none; /* Hide by default */
  flex-direction: column-reverse;
  justify-content: center;
  @media (min-width: 1200px) {
    display: flex; /* showing only on screens larger than 1199px */
  }
`;
const ReferenceViewOuter:React.FC<StyledDivProps> = ({children}) => {
  return (
    <StyledDiv>
        {children}
    </StyledDiv>
  )
}
export default ReferenceViewOuter;