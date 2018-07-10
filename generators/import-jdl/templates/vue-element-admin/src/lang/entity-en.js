export default {
<%_ entities.forEach((entity, index) => { _%>
  <%= entity.name %>: '<%= entity.name %>'<%= index === entities.length - 1 ? '' : ',' %>
<%_ }); _%>
}
