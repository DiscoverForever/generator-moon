// generated at <%=new Date().toLocaleString()%>
class <%=entity.name%> {
  <% entity.body.forEach(prop => { %>
    // <%=prop.javadoc%>
    <%=prop.name%>:<%=prop.type%>;
  <% })%>
}
  