export default {
<%_ entities.forEach((entity, index) => { _%>
  <%= entity.name %>: '<%= entity.javadoc ? entity.javadoc : entity.name %>'<%= index === entities.length - 1 ? '' : ',' %>
<%_ }); _%>
}
