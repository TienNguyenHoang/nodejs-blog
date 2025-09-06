function renderComment(comment, currentUser) {
    const isOwner = currentUser && String(currentUser.id) === String(comment.user._id);

    return `
<div class="d-flex mb-3 align-items-start" id="comment-${comment._id}" data-id="${comment._id}">
    <div class="flex-shrink-0">
        <img
            src="${comment.user.avatar || '/img/default-avatar.jpg'}"
            class="rounded-circle"
            style="width: 40px; height: 40px; object-fit: cover"
        />
    </div>
    <div class="flex-grow-1 ms-3">
        <h6 class="mb-0 d-flex justify-content-between">
            <span>${comment.user.username}</span>
            ${
                isOwner
                    ? `
            <div class="dropdown ms-auto">
                <button class="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Tùy chọn
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#" class="dropdown-item btn-edit-comment" data-id="${comment._id}">Sửa</a></li>
                    <li>
                        <a
                            href="#"
                            class="dropdown-item btn-delete-comment"
                            data-id="${comment._id}"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-comment-modal"
                        >Xóa</a>
                    </li>
                </ul>
            </div>
            `
                    : ''
            }
        </h6>
        <small class="text-muted">${new Date(comment.createdAt).toLocaleDateString('vi-VN')}</small>
        <p class="mb-0 comment-text" id="comment-content-${comment._id}">${comment.content}</p>
        <a href="#" class="btn btn-sm btn-link btn-reply-comment" data-id="${comment._id}">Trả lời</a>
        <div class="replis-list-containter">
            <div class="replies-list ms-4 mt-2" id="replies-${comment._id}"></div>
        </div>
        ${
            comment.repliesCount > 0
                ? `<p>
                    <a href="#" class="btn-load-more-replies" data-parent="${comment._id}">
                        Xem thêm <span id="replies-count">${comment.repliesCount}</span> phản hồi
                    </a>
                </p>`
                : ''
        }
    </div>
</div>
`;
}
