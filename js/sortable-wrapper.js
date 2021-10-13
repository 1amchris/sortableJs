const containerTemplate = $("#droppedElement_wrapperTemplate").clone()
containerTemplate
    .attr("id", null)
    .removeClass("visually-hidden")

const groupName = 'nested'

const sourceGroup = {
    name: groupName,
    pull: 'clone',
    put: false,
}
const destinationGroup = {
    name: groupName,
}

const sharedParams = {
    animation: 150,
    swapThreshold: 0.75,
    fallbackOnBody: true,
}
const sourceParams = {
    ...sharedParams,
    group: sourceGroup,
    sort: false,
}
const destinationParams = {
    ...sharedParams,
    group: destinationGroup,
    onMove: onMove_DestinationContainer,
    onAdd: onAdd_DestinationContainer,
}

const sortables = []

/**
 * Determines whether the target container can be dropped into
 *  Should only be implemented on root destination containers.
 * @param  {CustomEvent} event The current event
 * @return {Boolean}           The hovered container can be dropped into
 */
function onMove_DestinationContainer(event) {
    return event.to.dataset.uuid === null
}

/**
 * Removes and unsubscribes sub containers if they are empty
 *  Should only be implement on child destination containers.
 * @param  {CustomEvent} event The current event
 */
function onRemove_SubContainer(event) {
    const oldContainer = $(event.from)
    if (oldContainer.children().length === 0) {
        const index = sortables.findIndex(({ el }) => el.dataset.uuid === oldContainer.data('uuid'))
        if (index === -1) return

        sortables[index].destroy();
        sortables.splice(index, 1)
        oldContainer.remove()
    }
}

/**
 * Wraps the incoming element in a destination container if it isn't one
 * @param  {CustomEvent} event The current event
 */
function onAdd_DestinationContainer(event) {
    let item = $(event.item)
    if (item.data('uuid') == null) {
        item.wrap(containerTemplate)
        item.parent().attr('data-uuid', uuidv4())
    }
    sortables.push(
        new Sortable(item.parent().get(0), {
            ...sharedParams,
            group: destinationGroup,
            onRemove: onRemove_SubContainer,
        }),
    )
}

const sourceSortable = new Sortable(
    document.querySelector('#source'), {
    ...sharedParams,
    group: sourceGroup,
    sort: false,
})
const destinationSortable = new Sortable(
    document.querySelector("#destination"), {
    ...sharedParams,
    group: destinationGroup,
    onMove: onMove_DestinationContainer,
    onAdd: onAdd_DestinationContainer,
})

