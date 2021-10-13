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
    swapThreshold: 0.65,
    fallbackOnBody: true, // Appends the cloned DOM Element into the Document's body
    fallbackTolerance: 0, // Specify in pixels how far the mouves should move before it's considered as a drag
    delay: 500, // ms to define when the sorting should start
    delayOnTouchOnly: true, // only delay if user is using touch
    touchStartThreshold: 10, // px, how many pixels the point should move before cancelling a delayed drag event
    emptyInsertThreshold: 25, // px, distance mouse must be from empty sortable to insert drag element into it
}
const sourceParams = {
    group: sourceGroup,
    sort: false,
    ...sharedParams,
}
const destinationParams = {
    group: destinationGroup,
    onMove: onMove_DestinationContainer,
    onAdd: onAdd_DestinationContainer,
    ...sharedParams,
}

const sortables = []

/**
 * Determines whether the target container can be dropped into
 *  Should only be implemented on root destination containers.
 * @param  {CustomEvent} event The current event
 * @return {Boolean}           The hovered container can be dropped into
 */
function onMove_DestinationContainer(event) {
    return event.to.dataset.uuid == null
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
            group: destinationGroup,
            onRemove: onRemove_SubContainer,
            ...sharedParams,
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
    group: destinationGroup,
    ...sharedParams,
    onMove: onMove_DestinationContainer,
    onAdd: onAdd_DestinationContainer,
})

